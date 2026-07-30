import toast from 'react-hot-toast';
import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';

import useClient from '../../hooks/client/useClient';
import useClientCreate from '../../hooks/client/useClientCreate';
import useClientUpdate from '../../hooks/client/useClientUpdate';
import useClientDelete from '../../hooks/client/useClientDelete';
import ClientModal from '../../components/modals/ClientModal';

const emptyForm = { name: '', contact: '', company: '' };

const Clients = () => {
    const { data: clients = [], isLoading: loading, error } = useClient();

    // Inisialisasi hook mutasi
    const createClient = useClientCreate();
    const updateClient = useClientUpdate();
    const deleteClient = useClientDelete();

    const [clientSearch, setClientSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [clientForm, setClientForm] = useState(emptyForm);

    const filteredClients = useMemo(() => {
        const keyword = clientSearch.toLowerCase();
        return clients.filter((c) =>
            c.name.toLowerCase().includes(keyword) ||
            c.company.toLowerCase().includes(keyword) ||
            c.contact.toLowerCase().includes(keyword)
        );
    }, [clients, clientSearch]);

    const openNewClientModal = () => {
        setEditingClient(null);
        setClientForm(emptyForm);
        setIsModalOpen(true);
    };

    const openEditClientModal = (client) => {
        setEditingClient(client);
        setClientForm({ name: client.name, contact: client.contact, company: client.company });
        setIsModalOpen(true);
    };

    const handleSaveClient = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Menyimpan Data...');

        try {
            if (editingClient) {
                await updateClient.mutateAsync({ id: editingClient.id, data: clientForm });
                toast.success('Klien berhasil diperbarui!', { id: toastId });
            } else {
                await createClient.mutateAsync(clientForm);
                toast.success('Klien baru berhasil ditambahkan!', { id: toastId });
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Gagal menyimpan klien.', { id: toastId });
        }
    };

    const handleDeleteClient = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete client: ${name}?`)) return;

        const toastId = toast.loading('Menghapus Data...')
        try {
            await deleteClient.mutateAsync(id);
            toast.success(`Klien ${name} berhasil dihapus!`, { id: toastId });
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Gagal menghapus klien.', { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-xs">Loading clients...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-rose-400">
                <AlertCircle className="w-8 h-8" />
                <p className="text-xs">Gagal memuat data client. Silakan refresh halaman.</p>
            </div>
        );
    }

    return (
        <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Client Directory</h2>
                    <p className="text-xs text-slate-400">Kelola data klien dan kontak perusahaan</p>
                </div>

                <button
                    onClick={openNewClientModal}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Client</span>
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Cari nama, perusahaan, atau kontak..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                                <th className="py-3.5 px-6">Nama Klien</th>
                                <th className="py-3.5 px-6">Kontak</th>
                                <th className="py-3.5 px-6">Perusahaan</th>
                                <th className="py-3.5 px-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-500">
                                        Tidak ada client yang cocok dengan "{clientSearch}".
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-slate-200">
                                            {client.name}
                                        </td>
                                        <td className="py-4 px-6 text-slate-300">{client.contact}</td>
                                        <td className="py-4 px-6 text-slate-300">{client.company}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditClientModal(client)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Client"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClient(client.id, client.company)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Client"
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

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingClient={editingClient}
                clientForm={clientForm}
                setClientForm={setClientForm}
                onSave={handleSaveClient}
            />
        </main>
    );
};

export default Clients;