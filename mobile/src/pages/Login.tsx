import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonToast,
  IonSpinner,
  useIonRouter,
  IonIcon,
} from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { apiPost, setToken, setUserInfo } from '../services/api';

interface LoginResponse {
  status: string;
  message: string;
  data?: {
    user: { id: number; name: string; email: string; role: string };
    access_token: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('danger');
  const [showToast, setShowToast] = useState(false);

  const router = useIonRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToastMessage('Email dan Password wajib diisi');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost<LoginResponse>('/auth/login', { email, password });

      if (data.status === 'success' && data.data) {
        setToken(data.data.access_token);
        setUserInfo(data.data.user);
      }

      setToastMessage('✅ Login berhasil!');
      setToastColor('success');
      setShowToast(true);

      setTimeout(() => {
        router.push('/dashboard', 'forward', 'replace');
      }, 900);

    } catch (err: any) {
      setToastMessage(err?.message || 'Email atau password salah');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': '#0f172a' }}>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-slate-900">
          <div className="w-full max-w-md">

            {/* Header Branding */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg shadow-indigo-500/30 mb-5">
                <IonIcon icon={lockClosedOutline} style={{ fontSize: '36px', color: 'white' }} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang</h1>
              <p className="text-slate-400 text-sm">Masuk ke akun member kamu</p>
            </div>

            {/* Card Form */}
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl shadow-2xl border border-slate-700/60 p-6 sm:p-8">
              <form onSubmit={handleLogin} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Email Address
                  </label>
                  <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden focus-within:border-indigo-500 transition-colors">
                    <IonItem lines="none" style={{ '--background': 'transparent' }}>
                      <IonIcon icon={mailOutline} slot="start" style={{ color: '#64748b' }} />
                      <IonInput
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value!)}
                        style={{
                          '--placeholder-color': '#64748b',
                          '--placeholder-opacity': '1',
                          '--color': '#f1f5f9',
                        }}
                      />
                    </IonItem>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Password
                  </label>
                  <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden focus-within:border-indigo-500 transition-colors">
                    <IonItem lines="none" style={{ '--background': 'transparent' }}>
                      <IonIcon icon={lockClosedOutline} slot="start" style={{ color: '#64748b' }} />
                      <IonInput
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                        style={{
                          '--placeholder-color': '#64748b',
                          '--placeholder-opacity': '1',
                          '--color': '#f1f5f9',
                        }}
                      />
                    </IonItem>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <IonButton
                    type="submit"
                    expand="block"
                    disabled={loading}
                    style={{
                      '--background': 'linear-gradient(135deg, #4f46e5, #4338ca)',
                      '--background-hover': 'linear-gradient(135deg, #4338ca, #3730a3)',
                      '--border-radius': '0.875rem',
                      '--box-shadow': '0 4px 20px rgba(79, 70, 229, 0.35)',
                      height: '52px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      letterSpacing: '0.025em',
                    }}
                  >
                    {loading ? <IonSpinner name="crescent" /> : '🔑 Masuk'}
                  </IonButton>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-slate-500 text-xs font-medium">Belum punya akun?</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Link to Register */}
              <IonButton
                expand="block"
                fill="outline"
                routerLink="/register"
                routerDirection="forward"
                style={{
                  '--color': '#818cf8',
                  '--border-color': '#4f46e5',
                  '--background': 'transparent',
                  '--background-hover': 'rgba(79,70,229,0.1)',
                  '--border-radius': '0.875rem',
                  height: '46px',
                  fontWeight: '500',
                }}
              >
                Daftar Akun Baru
              </IonButton>
            </div>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color={toastColor}
          style={{ '--border-radius': '12px' }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
