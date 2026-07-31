import React, { useState, useEffect, useCallback } from 'react';
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
  IonModal,
  IonButtons,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import {
  timeOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  briefcaseOutline,
  pencilOutline,
  closeOutline,
  checkmarkDoneOutline,
  reloadOutline,
  hourglassOutline,
  calendarOutline,
} from 'ionicons/icons';
import { apiGet, apiPut, Task, TasksResponse } from '../services/api';
import NotificationBell from '../components/NotificationBell';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

const statusConfig: Record<TaskStatus, { label: string; icon: string; bg: string; text: string; border: string; glow: string }> = {
  pending: {
    label: 'Pending',
    icon: hourglassOutline,
    bg: 'rgba(100,116,139,0.15)',
    text: '#94a3b8',
    border: 'rgba(100,116,139,0.3)',
    glow: 'rgba(100,116,139,0.2)',
  },
  in_progress: {
    label: 'In Progress',
    icon: reloadOutline,
    bg: 'rgba(99,102,241,0.15)',
    text: '#818cf8',
    border: 'rgba(99,102,241,0.3)',
    glow: 'rgba(99,102,241,0.2)',
  },
  completed: {
    label: 'Completed',
    icon: checkmarkDoneOutline,
    bg: 'rgba(52,211,153,0.15)',
    text: '#34d399',
    border: 'rgba(52,211,153,0.3)',
    glow: 'rgba(52,211,153,0.2)',
  },
};

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: '600',
      background: cfg.bg,
      color: cfg.text,
      border: `1px solid ${cfg.border}`,
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      <IonIcon icon={cfg.icon} style={{ fontSize: '12px' }} />
      {cfg.label}
    </span>
  );
};

const isOverdue = (deadline: string, status: TaskStatus) =>
  new Date(deadline) < new Date() && status !== 'completed';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showToast, setShowToast] = useState(false);
  const router = useIonRouter();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<TasksResponse>('/member/tasks');
      setTasks(data.data ?? []);
    } catch (err: any) {
      if (err?.status === 401 || err?.message?.includes('401')) {
        router.push('/login', 'root', 'replace');
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const doRefresh = async (event: CustomEvent) => {
    await fetchTasks();
    event.detail.complete();
  };

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus: TaskStatus) => {
    if (!selectedTask) return;
    setUpdating(true);
    try {
      await apiPut(`/member/tasks/${selectedTask.id}`, { status: newStatus });
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: newStatus } : t));
      setIsModalOpen(false);
      setToastMsg('✅ Status task berhasil diperbarui!');
      setToastColor('success');
      setShowToast(true);
    } catch {
      setToastMsg('❌ Gagal memperbarui status, coba lagi');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setUpdating(false);
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f172a', '--color': 'white', '--border-color': '#1e293b' }}>
          <IonTitle style={{ fontWeight: '700', letterSpacing: '-0.02em', fontSize: '18px' }}>
            📋 My Tasks
          </IonTitle>
          <IonButtons slot="end">
            <NotificationBell />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#0f172a' }}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent pullingIcon="lines" refreshingSpinner="crescent" pullingText="Tarik untuk refresh" />
        </IonRefresher>

        <div style={{ padding: '16px', minHeight: '100%', background: '#0f172a' }}>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {[
              { label: 'Total', value: stats.total, color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
              { label: 'Pending', value: stats.pending, color: '#94a3b8', bg: 'rgba(100,116,139,0.1)' },
              { label: 'Progress', value: stats.in_progress, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
              { label: 'Done', value: stats.completed, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg,
                border: `1px solid ${s.color}22`,
                borderRadius: '12px',
                padding: '10px 6px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', letterSpacing: '0.04em', marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <IonSpinner name="crescent" style={{ color: '#6366f1', width: '36px', height: '36px' }} />
            </div>
          ) : tasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              background: 'rgba(30,41,59,0.5)',
              borderRadius: '20px',
              border: '1px solid #1e293b',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
              <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '500' }}>Tidak ada task untuk saat ini</p>
              <p style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>Selamat, semua task sudah selesai!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => openTaskModal(task)}
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #1a2535 100%)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: `1px solid ${isOverdue(task.deadline, task.status) ? 'rgba(248,113,113,0.35)' : '#2d3f5a'}`,
                    boxShadow: isOverdue(task.deadline, task.status) ? '0 0 12px rgba(239,68,68,0.1)' : '0 2px 8px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {/* Accent line */}
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: '3px',
                    background: statusConfig[task.status]?.text ?? '#64748b',
                    borderRadius: '16px 0 0 16px',
                  }} />

                  <div style={{ paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{
                        color: '#f1f5f9',
                        fontWeight: '600',
                        fontSize: '15px',
                        lineHeight: '1.4',
                        flex: 1,
                        paddingRight: '10px',
                        margin: 0,
                      }}>
                        {task.title}
                      </h3>
                      <StatusBadge status={task.status} />
                    </div>

                    {task.description && (
                      <p style={{
                        color: '#64748b',
                        fontSize: '13px',
                        marginBottom: '12px',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {task.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {task.project ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#818cf8',
                          background: 'rgba(99,102,241,0.12)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          <IonIcon icon={briefcaseOutline} style={{ fontSize: '12px' }} />
                          {task.project.name}
                        </span>
                      ) : <span />}

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: isOverdue(task.deadline, task.status) ? '#f87171' : '#64748b',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}>
                        <IonIcon icon={calendarOutline} style={{ fontSize: '12px' }} />
                        {new Date(task.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                        {isOverdue(task.deadline, task.status) && (
                          <span style={{ color: '#f87171', fontWeight: '700', fontSize: '10px' }}>• Overdue</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit hint */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '12px',
                    color: '#334155',
                  }}>
                    <IonIcon icon={pencilOutline} style={{ fontSize: '14px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---- Update Status Modal ---- */}
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
          initialBreakpoint={0.55}
          breakpoints={[0, 0.55]}
          style={{ '--background': '#0f172a' }}
        >
          <div style={{
            background: '#1e293b',
            minHeight: '100%',
            borderRadius: '24px 24px 0 0',
            padding: '24px',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', margin: 0 }}>
                  UPDATE STATUS TASK
                </p>
                <h2 style={{
                  color: '#f1f5f9',
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: '4px 0 0',
                  lineHeight: '1.3',
                  maxWidth: '240px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {selectedTask?.title}
                </h2>
              </div>
              <IonButton
                fill="clear"
                onClick={() => setIsModalOpen(false)}
                style={{ '--color': '#475569', margin: 0 }}
              >
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </div>

            {/* Status Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(Object.keys(statusConfig) as TaskStatus[]).map(status => {
                const cfg = statusConfig[status];
                const isActive = selectedTask?.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => !updating && handleUpdateStatus(status)}
                    disabled={updating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      border: `2px solid ${isActive ? cfg.text : '#2d3f5a'}`,
                      background: isActive ? cfg.bg : 'rgba(15,23,42,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      width: '100%',
                      boxShadow: isActive ? `0 0 16px ${cfg.glow}` : 'none',
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '12px',
                      background: cfg.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <IonIcon icon={cfg.icon} style={{ fontSize: '20px', color: cfg.text }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: isActive ? cfg.text : '#cbd5e1', fontWeight: '600', fontSize: '15px' }}>
                        {cfg.label}
                      </div>
                      <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>
                        {status === 'pending' && 'Belum mulai dikerjakan'}
                        {status === 'in_progress' && 'Sedang dikerjakan'}
                        {status === 'completed' && 'Sudah selesai dikerjakan'}
                      </div>
                    </div>
                    {isActive && (
                      <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '22px', color: cfg.text, flexShrink: 0 }} />
                    )}
                    {updating && selectedTask?.status !== status && (
                      <IonSpinner name="crescent" style={{ color: cfg.text, flexShrink: 0 }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </IonModal>

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

export default Tasks;
