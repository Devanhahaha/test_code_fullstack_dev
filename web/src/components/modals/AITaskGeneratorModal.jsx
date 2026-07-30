import { useState } from 'react';
import { Sparkles, X, Loader2, Plus, Trash2, Check } from 'lucide-react';
import useAITaskGenerator from '../../hooks/task/useAITaskGenerator';

const AITaskGeneratorModal = ({ isOpen, onClose, targetProjectForAi, onSaveTasks }) => {
    const [aiBrief, setAiBrief] = useState('');
    const [aiSource, setAiSource] = useState(null);
    const [suggestedTasks, setSuggestedTasks] = useState([]);

    const generateTasksMutation = useAITaskGenerator();

    if (!isOpen || !targetProjectForAi) return null;

    const handleGenerateAiTasks = () => {
        generateTasksMutation.mutate(
            {
                id: targetProjectForAi.id,
                data: { brief: aiBrief }
            },
            {
                onSuccess: (data) => {
                    const generated = data?.data || data?.tasks || data || [];
                    const tasksWithIds = generated.map((task, index) => ({
                        ...task,
                        id: Date.now() + index,
                    }));
                    setSuggestedTasks(tasksWithIds);
                    setAiSource('gemini');
                },
                onError: (error) => {
                    console.error("Gagal generate tasks:", error);
                    alert("Terjadi kesalahan saat memproses AI.");
                }
            }
        );
    };

    const handleAddSuggestedTaskManually = () => {
        const newTask = {
            id: Date.now(),
            title: '',
            category: 'Frontend',
            estimated_hours: 1
        };
        setSuggestedTasks([...suggestedTasks, newTask]);
    };

    const handleUpdateSuggestedTask = (id, field, value) => {
        setSuggestedTasks(suggestedTasks.map(task =>
            task.id === id ? { ...task, [field]: value } : task
        ));
    };

    const handleDeleteSuggestedTask = (id) => {
        setSuggestedTasks(suggestedTasks.filter(task => task.id !== id));
    };

    const handleApproveAndSaveTasks = () => {
        if (onSaveTasks) {
            onSaveTasks(targetProjectForAi.id, suggestedTasks);
        }
        setAiBrief('');
        setSuggestedTasks([]);
        setAiSource(null);
        onClose();
    };

    const clientName = targetProjectForAi?.client?.name || targetProjectForAi?.clientName || 'Unknown Client';
    const isGenerating = generateTasksMutation.isPending;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">

                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-100 text-sm">AI-Assisted Task Breakdown</h3>
                            <p className="text-[11px] text-slate-400">
                                Project: <span className="text-indigo-400 font-semibold">{targetProjectForAi.name}</span> ({clientName})
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Paste Project Brief / Client Requirements here
                            </label>
                            <span className="text-[10px] text-slate-500">Gemini AI Enabled</span>
                        </div>
                        <textarea
                            rows={4}
                            value={aiBrief}
                            onChange={(e) => setAiBrief(e.target.value)}
                            placeholder="e.g. Design a patient appointment portal with HIPAA video consultation..."
                            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <button
                            onClick={handleGenerateAiTasks}
                            disabled={isGenerating || !aiBrief.trim()}
                            className="px-5 py-2.5 bg-gradient from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Analyzing brief...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Generate Tasks ✨</span>
                                </>
                            )}
                        </button>

                        {aiSource && (
                            <span className="text-[10px] text-emerald-400 font-medium px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                ⚡ Decomposed via {aiSource === 'gemini' ? 'Gemini AI API' : 'Smart Decomposer'}
                            </span>
                        )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                                Suggested Tasks ({suggestedTasks.length})
                            </h4>
                            <button
                                onClick={handleAddSuggestedTaskManually}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Add Task Manually</span>
                            </button>
                        </div>

                        {suggestedTasks.length === 0 ? (
                            <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                                Paste a brief above and click "Generate Tasks ✨" to let AI automatically decompose your requirements into engineering tasks!
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {suggestedTasks.map((item) => (
                                    <div key={item.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center hover:border-slate-700 transition-colors">
                                        <div className="sm:col-span-6">
                                            <label className="block text-[10px] text-slate-500 mb-0.5">Task Title</label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => handleUpdateSuggestedTask(item.id, 'title', e.target.value)}
                                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label className="block text-[10px] text-slate-500 mb-0.5">Category</label>
                                            <select
                                                value={item.category}
                                                onChange={(e) => handleUpdateSuggestedTask(item.id, 'category', e.target.value)}
                                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                                            >
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                                <option value="Design">Design</option>
                                                <option value="QA">QA</option>
                                                <option value="DevOps">DevOps</option>
                                            </select>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] text-slate-500 mb-0.5">Est. Hours</label>
                                            <input
                                                type="number"
                                                min={1} max={100}
                                                value={item.estimated_hours}
                                                onChange={(e) => handleUpdateSuggestedTask(item.id, 'estimated_hours', Number(e.target.value))}
                                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="sm:col-span-1 text-right sm:text-center pt-2 sm:pt-4">
                                            <button onClick={() => handleDeleteSuggestedTask(item.id)} className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={handleApproveAndSaveTasks}
                        disabled={suggestedTasks.length === 0}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        <span>Approve & Save Tasks</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AITaskGeneratorModal;