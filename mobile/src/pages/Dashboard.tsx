import React, { useState, useEffect } from 'react';
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
  IonBadge,
  useIonRouter,
  IonButton,
  IonButtons
} from '@ionic/react';
import { 
  timeOutline, 
  checkmarkCircleOutline, 
  alertCircleOutline,
  logOutOutline,
  briefcaseOutline
} from 'ionicons/icons';

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  project?: {
    id: number;
    name: string;
  };
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useIonRouter();

  const fetchTasks = async () => {
    try {
      // Dummy endpoint, assuming we get tasks assigned to the current user
      // In a real app, you would pass the Bearer token in the header
      const token = localStorage.getItem('token');
      const response = await fetch('http://172.20.10.2:8000/api/member/tasks', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok && data.data) {
        setTasks(data.data);
      } else {
        // Fallback dummy data if backend is not running or throws error
        setTasks(getDummyTasks());
      }
    } catch (error) {
      console.error('Error fetching tasks', error);
      setTasks(getDummyTasks()); // Fallback for UI demonstration
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const doRefresh = async (event: CustomEvent) => {
    await fetchTasks();
    event.detail.complete();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login', 'forward', 'replace');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <IonIcon icon={checkmarkCircleOutline} />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <IonIcon icon={timeOutline} />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <IonIcon icon={alertCircleOutline} />
            Pending
          </span>
        );
    }
  };

  // Helper to generate dummy tasks if API fails
  const getDummyTasks = (): Task[] => [
    {
      id: 1,
      title: 'Fix Login Authentication Bug',
      description: 'Resolve the issue where users cannot login with Google OAuth.',
      deadline: '2026-08-01',
      status: 'in_progress',
      project: { id: 1, name: 'E-Commerce App' }
    },
    {
      id: 2,
      title: 'Design Dashboard UI',
      description: 'Create a responsive dashboard layout using Tailwind CSS.',
      deadline: '2026-08-05',
      status: 'pending',
      project: { id: 2, name: 'Internal Tool' }
    },
    {
      id: 3,
      title: 'Setup CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated deployment.',
      deadline: '2026-07-29',
      status: 'completed',
      project: { id: 1, name: 'E-Commerce App' }
    }
  ];

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f172a', '--color': 'white' }}>
          <IonTitle className="font-bold tracking-wide">My Tasks</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout} className="text-slate-300 hover:text-white">
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#0f172a' }}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent 
            pullingIcon="lines"
            refreshingSpinner="crescent"
            pullingText="Pull to refresh"
          />
        </IonRefresher>

        <div className="px-4 py-6 bg-slate-900 min-h-full">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back,</h2>
            <p className="text-slate-400">Here's your task breakdown for today.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <IonSpinner name="crescent" className="text-indigo-500" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-slate-400">No tasks assigned to you right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm active:scale-[0.98] transition-transform"
                  onClick={() => {/* Navigate to detail later */}}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white leading-tight pr-4">
                      {task.title}
                    </h3>
                    <div>{getStatusBadge(task.status)}</div>
                  </div>
                  
                  {task.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs font-medium border-t border-slate-700/50 pt-3">
                    {task.project ? (
                      <div className="flex items-center text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                        <IonIcon icon={briefcaseOutline} className="mr-1.5" />
                        <span className="truncate max-w-30">{task.project.name}</span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    
                    {task.deadline && (
                      <div className={`flex items-center ${
                        new Date(task.deadline) < new Date() && task.status !== 'completed' 
                          ? 'text-rose-400' 
                          : 'text-slate-400'
                      }`}>
                        <IonIcon icon={timeOutline} className="mr-1" />
                        {new Date(task.deadline).toLocaleDateString('id-ID', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
