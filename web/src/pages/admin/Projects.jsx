import { useState, useMemo } from 'react';
import { Plus, Search, Clock, CheckCircle2, AlertCircle, Sparkles, Trash2, Loader2, Edit2 } from 'lucide-react';
import useProject from '../../hooks/project/useProject';
import useProjectCreate from '../../hooks/project/useProjectCreate';
import useProjectUpdate from '../../hooks/project/useProjectUpdate';
import useProjectDelete from '../../hooks/project/useProjectDelete';
import ProjectModal from '../../components/modals/ProjectModal';
import useClient from '../../hooks/client/useClient';
import AITaskGeneratorModal from '../../components/modals/AITaskGeneratorModal';

const emptyForm = { name: '', client_id: '', deadline: '', status: 'pending' };

const Projects = () => {
    const { data: projectsData, isLoading: isProjectsLoading } = useProject();
    const { data: clientsData, isLoading: isClientsLoading } = useClient();

    const createProject = useProjectCreate();
    const updateProject = useProjectUpdate();
    const deleteProject = useProjectDelete();

    const projects = projectsData || [];
    const clients = clientsData || [];

    const [projectSearch, setProjectSearch] = useState('');
    const [projectStatusFilter, setProjectStatusFilter] = useState('All');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectForm, setProjectForm] = useState(emptyForm);

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [targetProjectForAi, setTargetProjectForAi] = useState(null);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                (project.clientName && project.clientName.toLowerCase().includes(projectSearch.toLowerCase()));
            const matchesStatus = projectStatusFilter === 'All' || project.status === projectStatusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, projectSearch, projectStatusFilter]);

    const openNewProjectModal = () => {
        setEditingProject(null);
        setProjectForm(emptyForm);
        setIsModalOpen(true);
    };

    const openEditProjectModal = (project) => {
        setEditingProject(project);
        setProjectForm({ name: project.name, client_id: project.client_id, deadline: project.deadline, status: project.status });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleSaveProject = (e) => {
        e.preventDefault();
        if (editingProject) {
            updateProject.mutate({ id: editingProject.id, data: projectForm }, {
                onSuccess: handleCloseModal
            });
        } else {
            createProject.mutate(projectForm, {
                onSuccess: handleCloseModal
            });
        }
    };

    const handleDeleteProject = (id, name) => {
        if (window.confirm(`Are you sure you want to delete project: ${name}?`)) {
            deleteProject.mutate(id);
        }
    };

    const openAiTaskGeneratorModal = (project) => {
        setTargetProjectForAi(project);
        setIsAiModalOpen(true);
    };

    const handleCloseAiModal = () => {
        setIsAiModalOpen(false);
        setTargetProjectForAi(null);
    };

    const handleSaveAiTasks = async (projectId, approvedTasks) => {
        // Logika untuk menyimpan tugas yang telah disetujui (Approved) ke Backend
        console.log(`Menyimpan tugas untuk Project ${projectId}:`, approvedTasks);
        
        // Contoh jika kamu membuat hook useTaskCreateBulk:
        // bulkCreateTasksMutation.mutate({ projectId, tasks: approvedTasks });
        // alert('Tugas berhasil dipecah dan disimpan!');
    };

    if (isProjectsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-xs">Loading projects...</p>
            </div>
        );
    }

    return (
        <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Projects Directory</h2>
                    <p className="text-xs text-slate-400">Track client deliverables, progress milestones, and run AI Task Generators</p>
                </div>
                <button
                    onClick={openNewProjectModal}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative max-w-md w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        placeholder="Search projects by title or client name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
                    {['All', 'pending', 'in_progress', 'completed'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setProjectStatusFilter(st)}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${projectStatusFilter === st
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                                <th className="py-3.5 px-6">Project Name</th>
                                <th className="py-3.5 px-6">Client</th>
                                <th className="py-3.5 px-6">Deadline</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6 text-right">Actions & AI Generator</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No projects found matching query.
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-slate-100">
                                            <p className="font-semibold text-slate-200">{project.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate max-w-xs">{project.brief}</p>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-indigo-400">{project.client.name}</td>
                                        <td className="py-4 px-6 text-slate-300">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {project.deadline}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${project.status === 'completed'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : project.status === 'in_progress'
                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    }`}
                                            >
                                                {project.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                                {project.status === 'in_progress' && <Clock className="w-3 h-3" />}
                                                {project.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openAiTaskGeneratorModal(project)}
                                                    className="px-3 py-1.5 from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
                                                    title="Generate AI Tasks from brief"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                                                    <span>Generate AI Tasks ✨</span>
                                                </button>

                                                <button
                                                    onClick={() => openEditProjectModal(project)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Project"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteProject(project.id, project.name)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Project"
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

            <ProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                clients={clients}
                editingProject={editingProject}
                projectForm={projectForm}
                setProjectForm={setProjectForm}
                onSave={handleSaveProject}
            />

            <AITaskGeneratorModal
                isOpen={isAiModalOpen}
                onClose={handleCloseAiModal}
                targetProjectForAi={targetProjectForAi}
                onSaveTasks={handleSaveAiTasks}
            />
        </main>
    );
}

export default Projects;