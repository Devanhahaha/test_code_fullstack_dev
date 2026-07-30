import toast from 'react-hot-toast';
import { useState, useMemo } from 'react';
import { Plus, Filter, Clock, Trash2, Loader2, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';
import TaskModal from '../../components/modals/TaskModal';
import { useSearchParams } from 'react-router';

import useTask from '../../hooks/task/useTask';
import useTaskCreate from '../../hooks/task/useTaskCreate';
import useTaskUpdate from '../../hooks/task/useTaskUpdate';
import useTaskDelete from '../../hooks/task/useTaskDelete';

import useProject from '../../hooks/project/useProject';
import useMember from '../../hooks/member/useMember';

const emptyForm = {
    title: '',
    project_id: '',
    assignee_id: '',
    category: '',
    estimated_hours: '',
    deadline: '',
    description: '',
    status: 'pending'
};

const Tasks = () => {
    const { data: tasks = [], isLoading: isLoadingTasks } = useTask();

    const [searchParams] = useSearchParams();
    const initialAssignee = searchParams.get('assignee') || 'All';

    const { data: projects = [] } = useProject();
    const { data: members = [] } = useMember();

    const createTask = useTaskCreate();
    const updateTask = useTaskUpdate();
    const deleteTask = useTaskDelete();

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskForm, setTaskForm] = useState(emptyForm);

    const [taskSearch, setTaskSearch] = useState('');
    const [taskProjectFilter, setTaskProjectFilter] = useState('All');
    const [taskAssigneeFilter, setTaskAssigneeFilter] = useState(initialAssignee);
    const [taskStatusFilter, setTaskStatusFilter] = useState('All');
    const [taskCategoryFilter, setTaskCategoryFilter] = useState('All');

    // Buka Modal untuk CREATE
    const openNewTaskModal = () => {
        setTaskForm(emptyForm);
        setIsTaskModalOpen(true);
    };

    // Buka Modal untuk EDIT
    const openEditTaskModal = (task) => {
        setTaskForm({
            id: task.id,
            title: task.title,
            project_id: task.project_id,
            assignee_id: task.assignee_id,
            category: task.category,
            estimated_hours: task.estimated_hours,
            deadline: task.deadline,
            description: task.description,
            status: task.status
        });
        setIsTaskModalOpen(true);
    };

    // Handle Submit (Bisa Create, Bisa Update)
    const handleSubmitTask = (e) => {
        e.preventDefault();
        const toastId = toast.loading('Menyimpan Data...')

        if (taskForm.id) {
            updateTask.mutate({ id: taskForm.id, data: taskForm }, {
                onSuccess: () => {
                    setIsTaskModalOpen(false);
                    setTaskForm(emptyForm);
                }
            });
            toast.success('Task berhasil diperbarui!', { id: toastId });
        } else {
            createTask.mutate(taskForm, {
                onSuccess: () => {
                    setIsTaskModalOpen(false);
                    setTaskForm(emptyForm);
                }
            });
            toast.success('Berhasil Menambahkan Task!', { id: toastId });
        }
    };

    const handleDeleteTask = (id, title) => {
        const toastId = toast.loading('Menghapus Data...');

        if (window.confirm(`Are you sure you want to delete task: ${title}?`)) {
            deleteTask.mutate(id);
        }
        toast.success(`Task ${title} berhasil dihapus!`, { id: toastId });
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchSearch = task.title?.toLowerCase().includes(taskSearch.toLowerCase());
            const matchProject = taskProjectFilter === 'All' || String(task.project_id) === String(taskProjectFilter);
            const matchAssignee = taskAssigneeFilter === 'All' || task.assignee?.name === taskAssigneeFilter;
            const matchStatus = taskStatusFilter === 'All' || task.status === taskStatusFilter;
            const matchCategory = taskCategoryFilter === 'All' || task.category === taskCategoryFilter;

            return matchSearch && matchProject && matchAssignee && matchStatus && matchCategory;
        });
    }, [tasks, taskSearch, taskProjectFilter, taskAssigneeFilter, taskStatusFilter, taskCategoryFilter]);

    if (isLoadingTasks) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-xs">Loading task...</p>
            </div>
        );
    }

    return (
        <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Task Management</h2>
                    <p className="text-xs text-slate-400">Filter, reassign, and update tasks</p>
                </div>

                <button
                    onClick={openNewTaskModal}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Task Manually</span>
                </button>
            </div>

            {/* Filter Engine */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Filter className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Filter Engine</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                    {/* Search Title */}
                    <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-medium">Search Title</label>
                        <input
                            type="text"
                            value={taskSearch}
                            onChange={(e) => setTaskSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Filter by Project */}
                    <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-medium">Project</label>
                        <select
                            value={taskProjectFilter}
                            onChange={(e) => setTaskProjectFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="All">All Projects</option>
                            {projects?.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter by Assignee */}
                    <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-medium">Assignee</label>
                        <select
                            value={taskAssigneeFilter}
                            onChange={(e) => setTaskAssigneeFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="All">All Assignees</option>
                            {members?.map((m) => (
                                <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter by Status */}
                    <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-medium">Status</label>
                        <select
                            value={taskStatusFilter}
                            onChange={(e) => setTaskStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Filter by Category */}
                    <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-medium">Category</label>
                        <select
                            value={taskCategoryFilter}
                            onChange={(e) => setTaskCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Design">Design</option>
                            <option value="QA">QA</option>
                            <option value="DevOps">DevOps</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                                <th className="py-3.5 px-6">Task Title & Category</th>
                                <th className="py-3.5 px-6">Project Name</th>
                                <th className="py-3.5 px-6">Assignee</th>
                                <th className="py-3.5 px-6">Status (Badge)</th>
                                <th className="py-3.5 px-6">Est. Hours & Deadline</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No tasks match the active filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-slate-100 max-w-xs">
                                            <p className="font-semibold text-slate-200">{task.title}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold">
                                                {task.category}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6 text-slate-300 font-medium">{task.project?.name || '-'}</td>

                                        <td className="py-4 px-6 text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={task.assigneeAvatar || `https://ui-avatars.com/api/?name=${task.assignee?.name || 'Unknown'}`}
                                                    alt={task.assignee?.name}
                                                    className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                                                />
                                                <span className="font-medium text-slate-300">{task.assignee?.name || 'Unassigned'}</span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${task.status === 'completed'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : task.status === 'in_progress'
                                                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    }`}
                                            >
                                                {task.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                                {task.status === 'in_progress' && <Clock className="w-3 h-3" />}
                                                {task.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6 text-slate-300">
                                            <p className="font-medium">{task.estimated_hours} hrs</p>
                                            <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3" /> Due {task.deadline}
                                            </p>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            {/* Ganti dropdown status dengan Action Edit & Delete penuh */}
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditTaskModal(task)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit task"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id, task.title)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete task"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TaskModal
                projects={projects}
                members={members}
                isTaskModalOpen={isTaskModalOpen}
                setIsTaskModalOpen={setIsTaskModalOpen}
                taskForm={taskForm}
                setTaskForm={setTaskForm}
                handleSubmitTask={handleSubmitTask}
            />
        </main>
    );
};

export default Tasks;