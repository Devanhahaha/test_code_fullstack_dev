import { X } from 'lucide-react';

const ProjectModal = ({
    isOpen,
    onClose,
    clients = [],
    editingProject = null,
    projectForm,
    setProjectForm,
    onSave,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-slate-100 text-base">
                        {editingProject ? 'Edit Project' : 'Create New Project'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSave} className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-400 mb-1 font-medium">Project Name</label>
                        <input
                            type="text"
                            required
                            value={projectForm.name || ''}
                            onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                            placeholder="e.g. Telehealth Mobile Companion App"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-1 font-medium">Select Client</label>
                        <select
                            required
                            value={projectForm.client_id || ''}
                            onChange={(e) => setProjectForm({ ...projectForm, client_id: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="" disabled>-- Choose Client --</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.company ? `${c.company} (${c.name})` : c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 mb-1 font-medium">Target Deadline</label>
                            <input
                                type="date"
                                required
                                value={projectForm.deadline || ''}
                                onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1 font-medium">Status</label>
                            <select
                                required
                                value={projectForm.status || 'pending'}
                                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-colors cursor-pointer"
                        >
                            {editingProject ? 'Update Project' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;