# Architecture Decision Document — ProjectPulse

> Dokumen ini menjelaskan keputusan arsitektur, alur data, integrasi AI, serta strategi kontainerisasi dan orkestrasi untuk platform **ProjectPulse**.

---

## 1. Ringkasan Stack

| Layer | Pilihan | Alasan Singkat |
|---|---|---|
| **Backend** | Laravel 12 (PHP 8.2) | Menyediakan framework REST API yang kokoh, ORM Eloquent yang intuitif, serta manajemen autentikasi berbasis Sanctum yang aman dan mudah diintegrasikan lintas platform (Web & Mobile). |
| **Web (Admin)** | React (Vite) + Tailwind CSS | Reaktif, performa *build* sangat cepat, UI modern dengan komponen *scannable*, serta integrasi state yang efisien untuk dashboard manajemen proyek. |
| **Mobile (Member)** | Ionic React | Stack utama pilihan Bilcode. Memungkinkan pengembangan *cross-platform* dengan *web skills* (React), performa native yang ringan, dan kemudahan dalam pengujian PWA / Android Emulator. |
| **Database** | PostgreSQL 16 | RDBMS enterprise-grade yang andal, memiliki integritas referensial yang ketat, dan performa query relasional yang unggul. |
| **LLM Provider** | Google Gemini (Gemini 1.5 Flash) | Latensi ultra-rendah, batasan *rate limit* gratis yang tinggi, serta kemampuan *structured JSON parsing* yang sangat akurat untuk kebutuhan *AI Task Breakdown*. |

---

## 2. Alur Data Utama

### A. Fitur Inti 1: Admin Menggenerasi & Menambah Task dari Brief Klien (ML Assisted)
1. **Client (React Web):** Admin menempelkan brief klien (teks bebas) di modal proyek dan menekan tombol *Generate*.
2. **Backend API (`POST /api/projects/{id}/tasks/generate`):** Controller memanggil `GeminiTaskBreakdownService`.
3. **Gemini Service:** Mengirimkan *prompting system* ketat ke Google Gemini API dengan menginstruksikan format keluaran wajib JSON Array.
4. **Respon LLM:** Gemini mengembalikan rekomendasi task lengkap dengan estimasi jam dan kategori (`frontend`/`backend`/`design`/`QA`).
5. **Client Approval:** Web menampilkan daftar draft task ke Admin. Admin dapat mengedit, menambah, atau menghapus task.
6. **Backend Batch Save (`POST /api/projects/{id}/tasks/batch`):** Admin menyetujui draft, dan Web menyimpannya secara masal ke PostgreSQL dalam satu transaksi database (`DB::transaction`).

### B. Fitur Inti 2: Member Update Status & Log Jam Kerja (Mobile)
1. **Mobile App (Ionic):** Member mengubah status task (misal: `todo` $\rightarrow$ `in_progress`) atau memasukkan durasi jam kerja.
2. **HTTP Request:** Mobile mengirim request ke `PATCH /api/member/tasks/{id}/status` atau `POST /api/member/tasks/{id}/time-logs` dengan menyertakan HTTP Bearer Token.
3. **Middleware & Validation:** Laravel Sanctum memverifikasi token dan memastikan `user_id` sesuai dengan assignee task.
4. **Database Transaction:** Eloquent memperbarui tabel `tasks` dan menyimpan entri baru ke tabel `time_logs`.
5. **Real-time Synchronization:** Perubahan status langsung memicu pembaruan pada statistik Dashboard Admin.

---

## 3. Desain Skema Database

Sistem menggunakan database relasional PostgreSQL dengan entitas utama sebagai berikut:

* **`users`**: Menyimpan kredensial, nama, dan role (`admin` atau `member`).
* **`clients`**: Menyimpan data klien (nama, perusahaan, kontak, email).
* **`projects`**: Terhubung ke `clients` ($1:N$). Menyimpan judul proyek, deskripsi brief, deadline, dan status.
* **`tasks`**: Terhubung ke `projects` ($1:N$) dan `users` sebagai assignee ($1:N$). Menyimpan judul, kategori, estimasi jam kerja, status (`todo`, `in_progress`, `review`, `done`), dan deadline.
* **`time_logs`**: Terhubung ke `tasks` ($1:N$) dan `users` ($1:N$). Mencatat durasi jam kerja dan catatan progres dari member.
* **`notifications`**: Menyimpan notifikasi *in-app* untuk member terkait penugasan task baru atau pengingat deadline.

---

## 4. Integrasi ML — AI Task Breakdown

- **Pendekatan Prompt:** Menggunakan teknik *System Instruction & Strict JSON Schema Output*. LLM dipaksa mengembalikan array objek dengan kunci pasti: `title`, `description`, `category`, dan `estimated_hours`.
- **Validasi Output:** Backend me-parse respon JSON dari Gemini. Jika struktur JSON tidak valid/rusak, backend melakukan sanitasi regex sebelum dilempar ke client.
- **Fallback & Resilience:** Jika API Key Gemini invalid, mencapai *rate limit*, atau *timeout* (10 detik), service tidak melempar error `500`. Backend mengembalikan respon `200` dengan flag `success: false` beserta pesan peringatan, memicu UI Web untuk beralih secara otomatis ke mode **Input Manual**.

---

## 5. Autentikasi & Otorisasi

- **Token Lintas Platform:** Menggunakan **Laravel Sanctum** (Stateful Token-based API Authentication). Token Bearer dikeluarkan saat login dan disimpan di `localStorage` (Web Admin) serta `Capacitor Preferences / Secure Storage` (Ionic Mobile).
- **Role-Based Access Control (RBAC):** 
  - Group route Admin terproteksi oleh middleware `auth:sanctum`.
  - Group route Member menggunakan prefix `/api/member` dan dibatasi secara eksplisit sehingga member hanya bisa melihat/memperbarui task yang di-assign ke ID mereka sendiri.

---

## 6. Containerization & Orchestration

- **Dockerfile Structure:**
  - `backend/be/Dockerfile`: Menggunakan *base image* `php:8.2-fpm-alpine`, dilengkapi extension `pdo_pgsql`, `bcmath`, `zip`, serta Composer untuk efisiensi ukuran image.
  - `web/Dockerfile`: Multi-stage build menggunakan `node:18-alpine` untuk memisahkan stage dependency resolution, build Vite, dan runtime preview/serve.
- **Docker Compose Dev Lokal:**
  Menggabungkan 3 service utama (`db`, `backend`, `web`) dalam satu jaringan privat, lengkap dengan *environment mapping* dan *volume mounting* untuk mendukung fitur *Hot-Reload*.
- **Kubernetes (k8s/):**
  Terdiri dari manifest `ConfigMap`, `Secret`, `Deployment`, `Service` (ClusterIP), dan `Ingress` (NGINX). Pod dipisah antara backend dan web, dengan alokasi *Readiness* dan *Liveness Probes* berbasis endpoint `/up` bawaan Laravel.
- **Scalability Check (>1 Replika Backend):**
  Karena autentikasi menggunakan token Sanctum yang tersimpan di PostgreSQL dan aplikasi bersifat *stateless* (tidak menyimpan file session di lokal filesystem container), backend siap di-scale hingga $n$ replika tanpa kendala konsistensi session.

---

## 7. Error Handling & Resiliency

- Respon API mengikuti standar JSON konsisten: `{"status": "error", "message": "Pesan deskriptif error", "errors": {}}`.
- Kegagalan sistem eksternal (LLM API) diisolasi agar tidak merusak *core workflow* manajemen proyek.

---

## 8. Trade-off & Keterbatasan

1. **Notifikasi Mobile:** Implementasi saat ini berfokus pada *In-App Badge & Notification List*. *Push Notification* tingkat OS (Firebase FCM) disiapkan untuk fase pengembangan lanjutan.
2. **File Storage:** Upload lampiran brief klien saat ini menggunakan penyimpanan teks direct. Pengembangan lebih lanjut dapat menambahkan S3 / MinIO bucket.