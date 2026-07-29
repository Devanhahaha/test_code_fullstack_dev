import { X } from 'lucide-react';

const ClientModal = ({
    isOpen,
    onClose,
    editingClient,
    clientForm,
    setClientForm,
    onSave,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-slate-100 text-base">
                        {editingClient ? 'Edit Client Details' : 'Add New Client'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSave} className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-400 mb-1 font-medium">Nama Klien</label>
                        <input
                            type="text"
                            required
                            value={clientForm.name}
                            onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-1 font-medium">Kontak</label>
                        <input
                            type="text"
                            required
                            value={clientForm.contact}
                            onChange={(e) => setClientForm({ ...clientForm, contact: e.target.value })}
                            placeholder="e.g. 081234567890"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-1 font-medium">Perusahaan</label>
                        <input
                            type="text"
                            required
                            value={clientForm.company}
                            onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                            placeholder="e.g. PT Technology Nusantara"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
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
                            Save Client
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientModal;