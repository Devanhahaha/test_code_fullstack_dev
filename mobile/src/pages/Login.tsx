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
  IonIcon
} from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const router = useIonRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToastMessage('Email dan Password wajib diisi');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.5:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log('Respon dari API Login:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal, periksa kredensial Anda');
      }

      const token = data.token || data.access_token || data.data?.token || data.data?.access_token;

      if (token) {
        localStorage.setItem('token', token);
        console.log('Token BERHASIL disimpan ke localStorage:', token);
      } else {
        console.warn('⚠️ Login sukses tapi token TIDAK DITEMUKAN dalam respon JSON:', data);
      }

      setToastMessage('Login berhasil');
      setShowToast(true);

      setTimeout(() => {
        router.push('/dashboard', 'forward', 'replace');
      }, 1000);

    } catch (error: any) {
      console.error('Error Login:', error);
      setToastMessage(error.message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      {/* We use bg-slate-900 on the content via CSS variable or className but in Ionic it's best to use --background */}
      <IonContent style={{ '--background': '#0f172a' }}>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-slate-900">
          <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
                <IonIcon icon={lockClosedOutline} className="text-3xl" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 mb-2">Member Login</h1>
              <p className="text-slate-400 text-sm">Masuk untuk melihat task Anda</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden focus-within:border-indigo-500 transition-colors">
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon icon={mailOutline} slot="start" className="text-slate-400" />
                    <IonInput
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onIonInput={(e) => setEmail(e.detail.value!)}
                      className="text-slate-100 font-medium"
                      style={{ '--placeholder-color': '#64748b', '--placeholder-opacity': '1' }}
                    />
                  </IonItem>
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden focus-within:border-indigo-500 transition-colors">
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon icon={lockClosedOutline} slot="start" className="text-slate-400" />
                    <IonInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onIonInput={(e) => setPassword(e.detail.value!)}
                      className="text-slate-100 font-medium"
                      style={{ '--placeholder-color': '#64748b', '--placeholder-opacity': '1' }}
                    />
                  </IonItem>
                </div>
              </div>

              <IonButton
                type="submit"
                expand="block"
                disabled={loading}
                className="h-12 font-semibold text-base mt-8 tracking-wide"
                style={{
                  '--background': '#4f46e5', /* indigo-600 */
                  '--background-hover': '#4338ca', /* indigo-700 */
                  '--border-radius': '0.75rem',
                  '--box-shadow': '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
                }}
              >
                {loading ? <IonSpinner name="crescent" /> : 'Sign In'}
              </IonButton>
            </form>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          style={{
            '--background': '#1e293b', /* slate-800 */
            '--color': '#f1f5f9', /* slate-100 */
            '--border-radius': '8px',
            '--box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
