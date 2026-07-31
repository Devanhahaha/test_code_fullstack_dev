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
  IonButtons,
} from '@ionic/react';
import {
  timeOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  briefcaseOutline,
  hourglassOutline,
  reloadOutline,
  checkmarkDoneOutline,
  layersOutline,
} from 'ionicons/icons';
import { apiGet, getUserInfo, TasksResponse, Task } from '../services/api';
import NotificationBell from '../components/NotificationBell';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

const statusConfig: Record<TaskStatus, { label: string; icon: string; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: hourglassOutline, color: '#94a3b8', bg: 'rgba(100,116,139,0.15)' },
  in_progress: { label: 'In Progress', icon: reloadOutline, color: '#818cf8', bg: 'rgba(99,102,241,0.15)' },
  completed: { label: 'Completed', icon: checkmarkDoneOutline, color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
};

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '4px 10px', borderRadius: '999px',
      fontSize: '11px', fontWeight: '600',
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}33`,
      whiteSpace: 'nowrap',
    }}>
      <IonIcon icon={cfg.icon} style={{ fontSize: '12px' }} />
      {cfg.label}
    </span>
  );
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUserInfo();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<TasksResponse>('/member/tasks');
      setTasks(data.data ?? []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const doRefresh = async (event: CustomEvent) => {
    await fetchTasks();
    event.detail.complete();
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const recentTasks = tasks.slice(0, 3);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f172a', '--color': 'white', '--border-color': '#1e293b' }}>
          <IonTitle style={{ fontWeight: '700', letterSpacing: '-0.02em', fontSize: '18px' }}>
            🏠 Dashboard
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

        <div style={{ padding: '16px', minHeight: '100%', background: '#0f172a', paddingBottom: '32px' }}>

          {/* Greeting Card */}
          <div style={{
            background: 'linear-gradient(135deg, #312e81 0%, #4c1d95 50%, #1e1b4b 100%)',
            borderRadius: '20px',
            padding: '22px',
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(79,70,229,0.25)',
          }}>
            {/* Decorative blobs */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '100px', height: '100px',
              background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute', bottom: '-30px', left: '40%',
              width: '80px', height: '80px',
              background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
            }} />

            <p style={{ color: '#a5b4fc', fontSize: '13px', fontWeight: '500', margin: '0 0 4px' }}>
              {getGreeting()},
            </p>
            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
              {user?.name ?? 'Member'} 👋
            </h2>

            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#c4b5fd', fontSize: '12px', fontWeight: '600' }}>
                  Progress Keseluruhan
                </span>
                <span style={{ color: '#a5b4fc', fontSize: '12px', fontWeight: '700' }}>
                  {completionRate}%
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${completionRate}%`,
                  background: 'linear-gradient(90deg, #818cf8, #34d399)',
                  borderRadius: '999px',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <p style={{ color: '#7c83b0', fontSize: '11px', marginTop: '6px', margin: '6px 0 0' }}>
                {stats.completed} dari {stats.total} task selesai
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Pending', value: stats.pending, color: '#94a3b8', bg: 'rgba(100,116,139,0.1)', icon: hourglassOutline },
              { label: 'Dikerjakan', value: stats.in_progress, color: '#818cf8', bg: 'rgba(99,102,241,0.1)', icon: reloadOutline },
              { label: 'Selesai', value: stats.completed, color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: checkmarkDoneOutline },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg,
                border: `1px solid ${s.color}22`,
                borderRadius: '16px',
                padding: '14px 10px',
                textAlign: 'center',
              }}>
                <IonIcon icon={s.icon} style={{ fontSize: '22px', color: s.color, marginBottom: '6px' }} />
                <div style={{ fontSize: '24px', fontWeight: '800', color: s.color, lineHeight: '1' }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', letterSpacing: '0.04em', marginTop: '4px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Tasks */}
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '15px', margin: 0 }}>
              <IonIcon icon={layersOutline} style={{ marginRight: '6px', color: '#818cf8', verticalAlign: 'middle' }} />
              Task Terbaru
            </h3>
            <span style={{ color: '#475569', fontSize: '11px' }}>{stats.total} total</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '120px' }}>
              <IonSpinner name="crescent" style={{ color: '#6366f1', width: '32px', height: '32px' }} />
            </div>
          ) : recentTasks.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 24px',
              background: 'rgba(30,41,59,0.5)', borderRadius: '16px', border: '1px solid #1e293b',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Belum ada task yang di-assign</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentTasks.map(task => (
                <div key={task.id} style={{
                  background: '#1e293b',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  border: '1px solid #2d3f5a',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <h4 style={{
                      color: '#e2e8f0', fontWeight: '600', fontSize: '14px',
                      margin: 0, flex: 1, lineHeight: '1.4',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {task.title}
                    </h4>
                    <StatusBadge status={task.status} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                    {task.project ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        color: '#818cf8', fontSize: '11px',
                        background: 'rgba(99,102,241,0.12)', padding: '2px 8px', borderRadius: '6px',
                      }}>
                        <IonIcon icon={briefcaseOutline} style={{ fontSize: '11px' }} />
                        {task.project.name}
                      </span>
                    ) : <span />}

                    {task.deadline && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        color: new Date(task.deadline) < new Date() && task.status !== 'completed'
                          ? '#f87171' : '#64748b',
                        fontSize: '11px',
                      }}>
                        <IonIcon icon={timeOutline} style={{ fontSize: '12px' }} />
                        {new Date(task.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {tasks.length > 3 && (
                <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                  <span style={{ color: '#475569', fontSize: '12px' }}>
                    + {tasks.length - 3} task lainnya — lihat di tab <strong style={{ color: '#818cf8' }}>My Tasks</strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
