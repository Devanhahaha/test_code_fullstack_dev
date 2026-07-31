import React from 'react';
import { IonIcon, useIonRouter } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import { useNotifications } from '../context/NotificationContext';

/**
 * NotificationBell — komponen header yang menampilkan badge unread_count.
 *
 * State TIDAK lagi dikelola di sini. Semua data berasal dari NotificationContext
 * yang di-fetch saat MemberLayout mount (on-mount, layout level).
 * Akibatnya badge langsung muncul tanpa perlu klik dulu.
 */
const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();
  const router = useIonRouter();

  const handleClick = () => {
    router.push('/notifications', 'forward', 'push');
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'relative',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        color: '#94a3b8',
        transition: 'color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.color = '#c7d2fe';
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.15)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
      aria-label={`Notifikasi${unreadCount > 0 ? ` (${unreadCount} belum dibaca)` : ''}`}
    >
      <IonIcon icon={notificationsOutline} style={{ fontSize: '22px' }} />

      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: '700',
            minWidth: '17px',
            height: '17px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            lineHeight: '1',
            boxShadow: '0 0 0 2px #0f172a',
            animation: 'pulse-badge 2s cubic-bezier(0.4,0,0.6,1) infinite',
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
