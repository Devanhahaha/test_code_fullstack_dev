import { X } from 'lucide-react';

const TaskModal = ({
    projects,
    members,
    isTaskModalOpen,
    setIsTaskModalOpen,
    taskForm,
    setTaskForm,
    handleSubmitTask
}) => {
    if (!isTaskModalOpen) return null;
    const isEditMode = !!taskForm.id;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-slate-100 text-base">
                        {isEditMode ? 'Edit Task Details' : 'Create Task Manually'}
                    </h3>
                    <button
                        onClick={() => setIsTaskModalOpen(false)}
                        className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmitTask} className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-400 mb-1 font-medium">Task Title</label>
                        <input
                            type="text"
                            required
                            value={taskForm.title || ''}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            placeholder="e.g. Build OAuth Login Controller"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-1 font-medium">Target Project</label>
                        <select
                            required
                            value={taskForm.project_id || ''}
                            onChange={(e) => setTaskForm({ ...taskForm, project_id: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="">-- Select Project --</option>
                            {projects?.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} {p.client?.name ? `(${p.client.name})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 mb-1 font-medium">Assign Engineer</label>
                            <select
                                value={taskForm.assignee_id || ''}
                                onChange={(e) => setTaskForm({ ...taskForm, assignee_id: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                                <option value="">-- Unassigned --</option>
                                {members?.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} {m.role ? `(${m.role})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1 font-medium">Category</label>
                            <select
                                value={taskForm.category || ''}
                                onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                                <option value="">-- None --</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Design">Design</option>
                                <option value="QA">QA</option>
                                <option value="DevOps">DevOps</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 mb-1 font-medium">Est. Hours</label>
                            <input
                                type="number"
                                min={0}
                                value={taskForm.estimated_hours || ''}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, estimated_hours: e.target.value ? Number(e.target.value) : '' })
                                }
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1 font-medium">Due Date</label>
                            <input
                                type="date"
                                value={taskForm.deadline || ''}
                                onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {isEditMode && (
                        <div>
                            <label className="block text-slate-400 mb-1 font-medium">Task Status</label>
                            <select
                                value={taskForm.status || 'pending'}
                                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-slate-400 mb-1 font-medium">Description</label>
                        <textarea
                            rows={2}
                            value={taskForm.description || ''}
                            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                            placeholder="Scope details and deliverables..."
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsTaskModalOpen(false)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-colors cursor-pointer"
                        >
                            {isEditMode ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;