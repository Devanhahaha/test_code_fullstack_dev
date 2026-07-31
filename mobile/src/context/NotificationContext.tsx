import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { apiGet, apiPatch, getToken, Notification, NotificationsResponse } from '../services/api';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface NotificationContextValue {
  /** Daftar notifikasi ter-cache */
  notifications: Notification[];
  /** Jumlah notifikasi belum dibaca — ini yang ditampilkan di badge bell */
  unreadCount: number;
  /** Apakah sedang proses fetch pertama */
  loading: boolean;
  /** Fetch / re-fetch dari server */
  fetchNotifications: () => Promise<void>;
  /** Mark satu notifikasi sebagai dibaca (optimistic + re-fetch) */
  markAsRead: (notification: Notification) => Promise<void>;
  /** Mark semua sebagai dibaca */
  markAllAsRead: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const NotificationContext = createContext<NotificationContextValue | null>(null);

// ─────────────────────────────────────────────
// Provider — letakkan di atas MemberLayout agar semua halaman member bisa akses
// ─────────────────────────────────────────────
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Ref untuk mencegah race condition: simpan apakah fetch sedang berlangsung
  const isFetching = useRef(false);

  const fetchNotifications = useCallback(async () => {
    // Jangan fetch ulang kalau tidak ada token (belum login)
    if (!getToken() || isFetching.current) return;

    isFetching.current = true;
    setLoading(true);
    try {
      const data = await apiGet<NotificationsResponse>('/member/notifications');
      setNotifications(data.data ?? []);
      setUnreadCount(data.unread_count ?? 0);
    } catch {
      // Saat tidak ter-autentikasi, biarkan saja — bell cukup menampilkan 0
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  // Fetch saat provider pertama kali mount (on mount = saat user masuk area member)
  useEffect(() => {
    fetchNotifications();

    // Auto-refresh tiap 60 detik agar badge tetap sinkron di background
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ── Mark satu item sebagai dibaca ──────────────────────────────────────────
  const markAsRead = useCallback(async (notification: Notification) => {
    if (notification.is_read) return;

    // STEP 1 — Optimistic update: kurangi badge & ubah status lokal LANGSUNG
    setUnreadCount(prev => Math.max(0, prev - 1));
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
    );

    try {
      // STEP 2 — Panggil API ke server
      await apiPatch(`/member/notifications/${notification.id}/read`);

      // STEP 3 — Re-fetch untuk memastikan state sinkron dengan backend
      await fetchNotifications();
    } catch {
      // Rollback jika API gagal
      setUnreadCount(prev => prev + 1);
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, is_read: false } : n)
      );
    }
  }, [fetchNotifications]);

  // ── Mark semua sebagai dibaca ──────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    const unreadItems = notifications.filter(n => !n.is_read);
    if (unreadItems.length === 0) return;

    // STEP 1 — Optimistic update: reset semua badge sekarang
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    try {
      // STEP 2 — Kirim semua PATCH secara paralel
      await Promise.all(
        unreadItems.map(n => apiPatch(`/member/notifications/${n.id}/read`))
      );
      // STEP 3 — Re-fetch untuk konfirmasi
      await fetchNotifications();
    } catch {
      // Rollback: fetch ulang untuk kembalikan state yang benar
      await fetchNotifications();
    }
  }, [notifications, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// ─────────────────────────────────────────────
// Hook — untuk dipakai di komponen mana saja
// ─────────────────────────────────────────────
export const useNotifications = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications harus dipakai di dalam <NotificationProvider>');
  }
  return ctx;
};
