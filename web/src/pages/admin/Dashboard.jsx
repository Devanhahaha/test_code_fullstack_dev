import { useState } from 'react';
import {
    Briefcase,
    AlertCircle,
    Users,
    Sparkles,
    ArrowUpRight,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router';
import useDashboardSummary from '../../hooks/dashboard/useDashboardSummary';
import useProject from '../../hooks/project/useProject';
import AITaskGeneratorModal from '../../components/modals/AITaskGeneratorModal';
import useTaskBatchCreate from '../../hooks/task/useTaskBatchCreate';

const Dashboard = () => {
    const navigate = useNavigate();

    const { summaryData, loading, error } = useDashboardSummary();
    const { data: projects = [] } = useProject();

    const batchCreateTask = useTaskBatchCreate();

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedProjectForAi, setSelectedProjectForAi] = useState(null);

    const handleOpenAiModal = () => {
        if (projects.length > 0) {
            setSelectedProjectForAi(projects[0]);
            setIsAiModalOpen(true);
        } else {
            alert("Silakan buat project terlebih dahulu sebelum menggunakan AI Task Generator.");
        }
    };

    const handleSaveAiTasks = (projectId, approvedTasks) => {
        const formattedTasks = approvedTasks.map(({ id, ...rest }) => rest);

        batchCreateTask.mutate(
            { projectId, tasks: formattedTasks },
            {
                onSuccess: () => {
                    alert('Berhasil menyimpan semua task ke database!');
                    setIsAiModalOpen(false);
                    setSelectedProjectForAi(null);
                },
                onError: (err) => {
                    console.error("Gagal menyimpan task:", err);
                    alert("Terjadi kesalahan saat menyimpan task ke database.");
                }
            }
        );
    };

    // Handling saat data masih di-load
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-xs">Loading dashboard summary...</p>
            </div>
        );
    }

    // Handling jika API gagal/error
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-rose-400">
                <AlertCircle className="w-8 h-8" />
                <p className="text-xs">Gagal memuat data. Silakan refresh halaman.</p>
            </div>
        );
    }

    // Ekstraksi data dari response backend
    const activeProjectsCount = summaryData?.active_project_count ?? 0;
    const overdueTasksCount = summaryData?.overdue_task_count ?? 0;
    const members = summaryData?.workload_per_member ?? [];
    const totalMembersCount = members.length;
    const STANDARD_CAPACITY_HOURS = 40;

    return (
        <main className="p-4 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
            {/* Top Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Active Projects */}
                <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">Active Projects</p>
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <Briefcase className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-100">{activeProjectsCount}</span>
                        <span className="text-xs text-slate-400">active in progress</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-400">
                        <span className="flex items-center gap-1 font-medium">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Live Data
                        </span>
                        <span className="text-slate-500">Real-time update</span>
                    </div>
                </div>

                {/* Overdue Tasks */}
                <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">Overdue Tasks</p>
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-rose-400">{overdueTasksCount}</span>
                        <span className="text-xs text-rose-300/70 font-medium">Require immediate action</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-rose-400 font-medium flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> High Priority
                        </span>
                        <button
                            onClick={() => navigate('/admin/task?status=overdue')}
                            className="text-indigo-400 hover:underline text-[11px] cursor-pointer"
                        >
                            Resolve tasks &rarr;
                        </button>
                    </div>
                </div>

                {/* Total Members */}
                <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">Total Members</p>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-100">{totalMembersCount}</span>
                        <span className="text-xs text-slate-400">Active team engineers</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-blue-400">
                        <span className="font-medium">Tracked via Spatie Role</span>
                        <span className="text-slate-500">Member Role</span>
                    </div>
                </div>
            </div>

            {/* AI Automation Highlight (4. bg-gradient-to-r ditambahkan) */}
            <div className="p-6 from-indigo-900/50 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" /> AI Automation Highlight
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Need instant task breakdown for a client brief?</h3>
                    <p className="text-xs text-slate-300 max-w-2xl">
                        Decompose unformatted client requirement briefs into structured engineering tasks with hours estimation using ProjectPulse AI.
                    </p>
                </div>
                <button
                    onClick={handleOpenAiModal}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0 cursor-pointer transition-colors"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch AI Task Generator ✨</span>
                </button>
            </div>

            {/* Workload per Member Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-slate-100">Workload per Member</h3>
                        <p className="text-xs text-slate-400">Team task distribution and active pending deliverables</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        {totalMembersCount} Members Tracked
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                                <th className="py-3.5 px-6">Member Name</th>
                                <th className="py-3.5 px-6">Role</th>
                                <th className="py-3.5 px-6 text-center">Active Tasks</th>
                                <th className="py-3.5 px-6">Load Progress</th>
                                <th className="py-3.5 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        No members found.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => {
                                    const pendingCount = member.pending_tasks_count ?? 0;
                                    const pendingHours = member.pending_hours ?? 0;
                                    const capacityPercent = Math.min(Math.round((pendingHours / STANDARD_CAPACITY_HOURS) * 100), 100);

                                    return (
                                        <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-4 px-6 font-medium text-slate-100 flex items-center gap-3">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1e293b&color=818cf8`}
                                                    alt={member.name}
                                                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                                                />
                                                <div>
                                                    <p className="font-semibold text-slate-200">{member.name}</p>
                                                    <p className="text-[10px] text-slate-500">{member.email}</p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-slate-300">{member.role}</td>

                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full font-bold text-xs ${pendingCount > 2
                                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            : 'bg-slate-800 text-slate-300'
                                                        }`}
                                                >
                                                    {pendingCount} Tasks
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 w-48">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-slate-400">
                                                        <span>Load Status ({pendingHours}h / {STANDARD_CAPACITY_HOURS}h)</span>
                                                        <span className="font-semibold text-slate-200">{capacityPercent}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-300 ${capacityPercent >= 80
                                                                    ? 'bg-rose-500'
                                                                    : capacityPercent >= 40
                                                                        ? 'bg-amber-500'
                                                                        : 'bg-emerald-500'
                                                                }`}
                                                            style={{ width: `${capacityPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => navigate(`/admin/task?assignee=${member.name}`)}
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                                                >
                                                    View Assigned Tasks &rarr;
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AITaskGeneratorModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                targetProjectForAi={selectedProjectForAi}
                onSaveTasks={handleSaveAiTasks}
            />
        </main>
    );
};

export default Dashboard;