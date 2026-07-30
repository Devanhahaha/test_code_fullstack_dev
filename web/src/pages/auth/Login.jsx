import toast from 'react-hot-toast';
import { Zap, AlertCircle, ChevronRight } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import useLogin from "../../hooks/auth/useLogin";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();
    const { mutate, isPending } = useLogin()
    const { setIsAuthenticated } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors('');

        mutate({
            email,
            password,
        }, {
            onSuccess: (data) => {

                Cookies.set('token', data.data.access_token);

                Cookies.set('user', JSON.stringify({
                    id: data.data.user.id,
                    name: data.data.user.name,
                    email: data.data.user.email,
                    role: data.data.user.role,
                }));

                setIsAuthenticated(true);
                toast.success('Berhasil Login! Selamat Datang.')
                navigate('/admin/dashboard');
            },
            onError: (error) => {
                const response = error.response?.data;
                if (error.response?.status === 401) {
                    setErrors(response.message);
                }
                else if (error.response?.status === 422) {
                    const firstErrorMsg = Object.values(response.errors)[0][0];
                    setErrors(firstErrorMsg);
                } 
                else {
                    toast.error("Terjadi kesalahan pada server. Coba lagi nanti.");
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
            {/* Subtle geometric backdrop glows */}
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {/* Logo Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500 text-white shadow-xl shadow-indigo-500/20 mb-4">
                        <Zap className="w-8 h-8 fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">ProjectPulse</h1>
                    <p className="text-sm text-slate-400 mt-1">Enterprise Project & Team Workload Intelligence</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-100">Sign in to your account</h2>
                        <p className="text-xs text-slate-400 mt-1">Access admin dashboard, clients, and AI task engine</p>
                    </div>

                    {errors && (
                        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errors}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@bilcode.com"
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-medium text-slate-300">Password</label>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                        >
                            <span>{isPending ? "Loading..." : "Sign In to"}</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-500 mt-6">
                    ProjectPulse v2.5 Enterprise • Secure OAuth 2.0 & AI Task Decomposition
                </p>
            </div>
        </div>
    )
}

export default Login