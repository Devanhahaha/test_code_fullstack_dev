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
import { mailOutline, lockClosedOutline, personOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { apiPost, setToken, setUserInfo } from '../services/api';

interface RegisterResponse {
  status: string;
  message: string;
  data?: {
    user: { id: number; name: string; email: string; role: string };
    access_token: string;
  };
  errors?: Record<string, string[]>;
}

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('danger');
  const [showToast, setShowToast] = useState(false);

  const router = useIonRouter();

  const showError = (msg: string) => {
    setToastMessage(msg);
    setToastColor('danger');
    setShowToast(true);
  };

  const showSuccess = (msg: string) => {
    setToastMessage(msg);
    setToastColor('success');
    setShowToast(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return showError('Nama lengkap wajib diisi');
    if (!email.trim()) return showError('Email wajib diisi');
    if (password.length < 8) return showError('Password minimal 8 karakter');
    if (password !== passwordConfirm) return showError('Konfirmasi password tidak cocok');

    setLoading(true);
    try {
      const data = await apiPost<RegisterResponse>('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirm,
      });

      if (data.status === 'success' && data.data) {
        setToken(data.data.access_token);
        setUserInfo(data.data.user);
        showSuccess('Registrasi berhasil! Selamat datang 🎉');
        setTimeout(() => {
          router.push('/dashboard', 'forward', 'replace');
        }, 1200);
      }
    } catch (err: any) {
      if (err?.errors) {
        const firstError = Object.values(err.errors as Record<string, string[]>)[0];
        showError(Array.isArray(firstError) ? firstError[0] : 'Validasi gagal');
      } else {
        showError(err?.message || 'Registrasi gagal, coba lagi');
      }
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-5">
                <IonIcon icon={personOutline} style={{ fontSize: '36px', color: 'white' }} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h1>
              <p className="text-slate-400 text-sm">Daftarkan dirimu sebagai member tim</p>
            </div>

            {/* Card Form */}
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl shadow-2xl border border-slate-700/60 p-6 sm:p-8">
              <form onSubmit={handleRegister} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Nama Lengkap
                  </label>
                  <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden focus-within:border-indigo-500 transition-colors">
                    <IonItem lines="none" style={{ '--background': 'transparent' }}>
                      <IonIcon icon={personOutline} slot="start" style={{ color: '#64748b' }} />
                      <IonInput
                        type="text"
                        placeholder="Nama kamu"
                        value={name}
                        onIonInput={(e) => setName(e.detail.value!)}
                        style={{
                          '--placeholder-color': '#64748b',
                          '--placeholder-opacity': '1',
                          '--color': '#f1f5f9',
                        }}
                      />
                    </IonItem>
                  </div>
                </div>

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
                        placeholder="Minimal 8 karakter"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Konfirmasi Password
                  </label>
                  <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden focus-within:border-indigo-500 transition-colors">
                    <IonItem lines="none" style={{ '--background': 'transparent' }}>
                      <IonIcon
                        icon={password && passwordConfirm && password === passwordConfirm ? checkmarkCircleOutline : alertCircleOutline}
                        slot="start"
                        style={{
                          color: password && passwordConfirm
                            ? (password === passwordConfirm ? '#34d399' : '#f87171')
                            : '#64748b'
                        }}
                      />
                      <IonInput
                        type="password"
                        placeholder="Ulangi password"
                        value={passwordConfirm}
                        onIonInput={(e) => setPasswordConfirm(e.detail.value!)}
                        style={{
                          '--placeholder-color': '#64748b',
                          '--placeholder-opacity': '1',
                          '--color': '#f1f5f9',
                        }}
                      />
                    </IonItem>
                  </div>
                  {password && passwordConfirm && password !== passwordConfirm && (
                    <p className="text-rose-400 text-xs mt-1 ml-1">Password tidak cocok</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <IonButton
                    type="submit"
                    expand="block"
                    disabled={loading}
                    style={{
                      '--background': 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      '--background-hover': 'linear-gradient(135deg, #4338ca, #6d28d9)',
                      '--border-radius': '0.875rem',
                      '--box-shadow': '0 4px 20px rgba(79, 70, 229, 0.35)',
                      height: '52px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      letterSpacing: '0.025em',
                    }}
                  >
                    {loading ? <IonSpinner name="crescent" /> : '🚀 Daftar Sekarang'}
                  </IonButton>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-slate-500 text-xs font-medium">Sudah punya akun?</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Link to Login */}
              <IonButton
                expand="block"
                fill="outline"
                routerLink="/login"
                routerDirection="back"
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
                Masuk ke Akun
              </IonButton>
            </div>

            {/* Footer */}
            <p className="text-center text-slate-600 text-xs mt-6">
              Dengan mendaftar, kamu menyetujui syarat & ketentuan yang berlaku.
            </p>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3500}
          position="bottom"
          color={toastColor}
          style={{
            '--border-radius': '12px',
            '--box-shadow': '0 10px 30px rgba(0,0,0,0.5)',
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
