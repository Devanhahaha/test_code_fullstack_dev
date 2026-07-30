import { useState } from "react";
import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Building2, Briefcase, CheckSquare, LogOut, Zap, X } from 'lucide-react';
import useLogout from '../hooks/auth/useLogout';
import useUser from '../hooks/auth/useUser';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const location = useLocation();

    const logout = useLogout();
    const user = useUser();

    const isActive = (path) => location.pathname.includes(path);

    return (
        <>
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-slate-950/80 z-40 md:hidden backdrop-blur-sm"
                />
            )}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div>
                    <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-100 text-base tracking-tight leading-none">
                                    ProjectPulse
                                </h2>
                                <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">
                                    Enterprise Admin
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <nav className="p-4 space-y-1">
                        <Link
                            to="/admin/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive('dashboard')
                                    ? 'bg-blue-500 text-white shadow-md shadow-indigo-600/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            to="/admin/client"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive('client')
                                    ? 'bg-blue-500 text-white shadow-md shadow-indigo-600/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                        >
                            <Building2 className="w-4 h-4" />
                            <span>Clients</span>
                        </Link>

                        <Link
                            to="/admin/project"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive('project')
                                    ? 'bg-blue-500 text-white shadow-md shadow-indigo-600/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-4 h-4" />
                                <span>Projects</span>
                            </div>
                        </Link>

                        <Link
                            to="/admin/tasks"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive('task')
                                    ? 'bg-blue-500 text-white shadow-md shadow-indigo-600/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <CheckSquare className="w-4 h-4" />
                                <span>Tasks</span>
                            </div>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 space-y-3">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            alt="Admin Avatar"
                            className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        />
                        <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar