import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonIcon,
  IonToast,
  IonButtons,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import {
  notificationsOutline,
  checkmarkCircleOutline,
  timeOutline,
  arrowBackOutline,
  mailOpenOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { Notification } from '../services/api';
import { useNotifications } from '../context/NotificationContext';

/**
 * Halaman daftar notifikasi reminder H-1 deadline.
 *
 * Semua state (notifications, unreadCount, loading) berasal dari NotificationContext.
 * Ini memastikan badge di NotificationBell turun LANGSUNG (optimistic update)
 * saat item diklik di sini — karena keduanya berbagi state yang sama.
 */
const Notifications: React.FC = () => {
  const router = useIonRouter();

  // ── Ambil data & aksi dari context (shared state) ──────────────────────────
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // Toast hanya untuk error lokal
  const [toastMsg, setToastMsg] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showToast, setShowToast] = useState(false);

  // ── Pull-to-refresh ────────────────────────────────────────────────────────
  const doRefresh = async (event: CustomEvent) => {
    await fetchNotifications();
    event.detail.complete();
  };

  // ── Mark satu notifikasi (delegasi ke context, lalu tampilkan toast kalau error) ──
  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.is_read) return;
    try {
      await markAsRead(notification);
      // Tidak perlu toast sukses — perubahan visual sudah langsung terlihat
    } catch {
      setToastMsg('Gagal menandai notifikasi sebagai dibaca');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  // ── Mark semua dibaca ──────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setToastMsg('✅ Semua notifikasi ditandai dibaca');
      setToastColor('success');
      setShowToast(true);
    } catch {
      setToastMsg('Gagal memproses, coba lagi');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  // ── Waktu relatif ──────────────────────────────────────────────────────────
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHr < 24) return `${diffHr} jam lalu`;
    if (diffDay === 1) return 'Kemarin';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f172a', '--color': 'white', '--border-color': '#1e293b' }}>
          <IonButtons slot="start">
            <IonButton onClick={() => router.goBack()} style={{ '--color': '#94a3b8' }}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>

          <IonTitle style={{ fontWeight: '700', letterSpacing: '-0.02em', fontSize: '18px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IonIcon icon={notificationsOutline} style={{ fontSize: '20px', color: '#818cf8' }} />
              Notifikasi
              {unreadCount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  minWidth: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 6px',
                  // Badge di halaman ini ikut animasi agar konsisten dengan bell
                  animation: 'pulse-badge 2s cubic-bezier(0.4,0,0.6,1) infinite',
                }}>
                  {unreadCount}
                </span>
              )}
            </span>
          </IonTitle>

          {unreadCount > 0 && (
            <IonButtons slot="end">
              <IonButton
                onClick={handleMarkAllRead}
                style={{ '--color': '#818cf8', fontSize: '12px' }}
              >
                Baca Semua
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#0f172a' }}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon="lines"
            refreshingSpinner="crescent"
            pullingText="Tarik untuk refresh"
          />
        </IonRefresher>

        <div style={{ minHeight: '100%', background: '#0f172a' }}>

          {/* ── Loading ───────────────────────────────────────────────────── */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
              <IonSpinner name="crescent" style={{ color: '#6366f1', width: '36px', height: '36px' }} />
            </div>

          /* ── Empty state ─────────────────────────────────────────────── */
          ) : notifications.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '64px 24px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '80px', height: '80px',
                background: 'rgba(99,102,241,0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <IonIcon icon={notificationsOutline} style={{ fontSize: '36px', color: '#4f46e5' }} />
              </div>
              <p style={{ color: '#94a3b8', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                Tidak ada notifikasi
              </p>
              <p style={{ color: '#475569', fontSize: '13px', marginTop: '8px' }}>
                Notifikasi reminder H-1 deadline akan muncul di sini
              </p>
            </div>

          /* ── List ────────────────────────────────────────────────────── */
          ) : (
            <>
              {unreadCount > 0 && (
                <div style={{ padding: '16px 16px 8px' }}>
                  <p style={{
                    color: '#475569',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.06em',
                    margin: 0,
                  }}>
                    BELUM DIBACA ({unreadCount})
                  </p>
                </div>
              )}

              <div>
                {notifications.map((notif, idx) => {
                  const isLast = idx === notifications.length - 1;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '14px 16px',
                        background: notif.is_read ? 'transparent' : 'rgba(99,102,241,0.06)',
                        borderBottom: isLast ? 'none' : '1px solid #1e293b',
                        cursor: notif.is_read ? 'default' : 'pointer',
                        transition: 'background 0.25s ease',
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        background: notif.is_read ? 'rgba(30,41,59,0.8)' : 'rgba(99,102,241,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: `1px solid ${notif.is_read ? '#1e293b' : 'rgba(99,102,241,0.3)'}`,
                        transition: 'background 0.25s ease, border-color 0.25s ease',
                      }}>
                        <IonIcon
                          icon={notif.is_read ? mailOpenOutline : alertCircleOutline}
                          style={{
                            fontSize: '20px',
                            color: notif.is_read ? '#475569' : '#818cf8',
                            transition: 'color 0.25s ease',
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <h4 style={{
                            color: notif.is_read ? '#94a3b8' : '#e2e8f0',
                            fontWeight: notif.is_read ? '500' : '700',
                            fontSize: '14px',
                            margin: 0,
                            lineHeight: '1.4',
                            transition: 'color 0.25s ease, font-weight 0.25s ease',
                          }}>
                            {notif.title}
                          </h4>
                          {/* Titik biru unread indicator */}
                          {!notif.is_read && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#6366f1',
                              flexShrink: 0,
                              marginTop: '4px',
                              boxShadow: '0 0 6px rgba(99,102,241,0.6)',
                            }} />
                          )}
                        </div>

                        <p style={{
                          color: notif.is_read ? '#475569' : '#64748b',
                          fontSize: '13px',
                          margin: '4px 0 0',
                          lineHeight: '1.5',
                        }}>
                          {notif.message}
                        </p>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '8px',
                        }}>
                          <IonIcon
                            icon={notif.is_read ? checkmarkCircleOutline : timeOutline}
                            style={{ fontSize: '12px', color: notif.is_read ? '#34d399' : '#64748b' }}
                          />
                          <span style={{ color: '#475569', fontSize: '11px' }}>
                            {formatTime(notif.created_at)}
                          </span>
                          {notif.is_read ? (
                            <span style={{ color: '#34d399', fontSize: '11px', fontWeight: '600' }}>
                              · Sudah dibaca
                            </span>
                          ) : (
                            <span style={{ color: '#818cf8', fontSize: '11px', fontWeight: '600' }}>
                              · Ketuk untuk tandai dibaca
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={2500}
          position="bottom"
          color={toastColor}
          style={{ '--border-radius': '12px' }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
