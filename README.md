# Take-Home Technical Test — Full Stack Developer
## ProjectPulse — Platform Manajemen Klien & Proyek Internal

[![Laravel 12](https://img.shields.io/badge/Backend-Laravel%2012-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/Web-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Ionic](https://img.shields.io/badge/Mobile-Ionic%20React-3880FF?style=for-the-badge&logo=ionic)](https://ionicframework.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-4169E1?style=for-the-badge&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Orchestration-Docker%20%26%20Kubernetes-2496ED?style=for-the-badge&logo=docker)](https://docker.com)

Repository ini berisi implementasi **ProjectPulse**, platform manajemen proyek internal yang menjembatani kebutuhan **Project Manager / Admin** (via Web Dashboard) dan **Team Member / Developer** (via Mobile App) dengan integrasi kecerdasan buatan Google Gemini untuk fitur *AI Task Breakdown*.

---

## 🚀 Fitur yang Diimplementasikan

### 1. Web Admin (React + Vite + Tailwind CSS)
* **Autentikasi & Otorisasi:** Login khusus Role Admin (PM).
* **CRUD Klien & Proyek:** Kelola data klien, perusahaan, deadline, dan status proyek.
* **AI Task Breakdown Generator:** Mengubah brief deskripsi proyek menjadi rekomendasi task terstruktur (kategori, estimasi jam, deskripsi) via Google Gemini API.
* **Approve & Batch Save:** Admin dapat menambah, mengedit, atau menghapus saran AI sebelum disetujui dan disimpan masal ke database.
* **Dashboard Analytics:** Ringkasan statistik proyek aktif, task overdue, dan distribusi workload anggota tim.

### 2. Mobile App Member (Ionic React)
* **Autentikasi Member:** Login khusus Role Member (Developer/Desainer).
* **Task Management:** Daftar task pribadi dengan filter status (`pending`, `in_progress`, `completed`).
* **Progress Tracking & Time Log:** Update status task dan pencatatan log jam kerja beserta catatan progres.
* **In-App Notifications:** Alert & badge penugasan task baru dan pengingat deadline.

### 3. Backend & Orchestration (Laravel 12 + PostgreSQL + K8s)
* REST API terintegrasi dengan Laravel Sanctum Bearer Token.
* Validasi input komprehensif & format error response seragam.
* Containerization menggunakan Docker, Docker Compose, dan manifest Kubernetes (`k8s/`).

---

## 🛠️ Cara Menjalankan Aplikasi

### Option 1: Menggunakan Docker Compose (Rekomendasi Utama)

1. **Pastikan Docker Desktop sudah berjalan di komputer kamu.**
2. **Setup File Environment Backend:**
   ```bash
   cp backend/be/.env.example backend/be/.env
   ```
   *(Opsional: Isi `GEMINI_API_KEY` di `backend/be/.env` jika ingin menguji fitur AI live).*
3. **Jalankan Container:**
   ```bash
   docker-compose up --build -d
   ```
4. **Akses Layanan:**
   * **Web Admin:** `http://localhost:5173`
   * **Backend API:** `http://localhost:8000/api`
   * **PostgreSQL Database:** `localhost:5433`

---

### Option 2: Menjalankan Mobile App (Ionic React)

1. Masuk ke direktori mobile:
   ```bash
   cd mobile
   ```
2. Install dependency dan jalankan server lokal:
   ```bash
   npm install
   npx ionic serve
   ```
3. Aplikasi mobile akan terbuka di `http://localhost:8100`.

---

### Option 3: Deploy ke Cluster Kubernetes Lokal (k8s/)

1. Salin file contoh secret K8s:
   ```bash
   cp k8s/secret.example.yaml k8s/secret.yaml
   ```
2. Jalankan perintah `kubectl` untuk menerapkan seluruh manifest:
   ```bash
   kubectl apply -f k8s/
   ```
3. Cek status pod & service:
   ```bash
   kubectl get pods,services,ingress
   ```

---

## 🔑 Kredensial Default (Seeder Data)

* **Admin (Web PM):** `admin@bilcode.com` / `password123`
* **Member (FullStack Developer):** `fullstack@bilcode.com` / `password123` (Login di Mobile)

---

## 📄 Dokumentasi API & Arsitektur

* **Postman Collection:** Terletak di file **`docs/postman_collection.json`** (Lengkap dengan seluruh endpoint Auth, Users, CRUD Clients, CRUD Projects, AI Task Generator, Task Filters, & Member Endpoints).
* **Architecture Decision Document:** Terletak di file **`docs/architecture.md`** (Menjelaskan keputusan teknis, diagram alur data, integrasi ML, serta strategi K8s).

---

## 📂 Struktur Direktori Proyek

```text
.
├── backend/be/            # Backend REST API (Laravel 12, Sanctum, Gemini Client)
├── web/                   # Dashboard Web Admin (React + Vite + Tailwind CSS)
├── mobile/                # Mobile App Member (Ionic React)
├── k8s/                   # Manifest Kubernetes (Deployment, Service, ConfigMap, Ingress)
├── docs/                  # Dokumentasi Resmi Proyek
│   ├── architecture.md    # Architecture Decision Document
│   └── postman_collection.json # Full Postman API Collection
└── docker-compose.yml     # Orchestration Development Lokal
```

---

## 👨‍💻 Submission Candidate

* **Aplikasi:** ProjectPulse — Full Stack Technical Assessment
* **Perusahaan:** Bilcode Technology