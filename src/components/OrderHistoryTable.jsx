import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Search, Calendar, User, Phone, FileText, CheckCircle, XCircle, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { safeJSONParse } from '../utils/helpers';
import OrderDetailsModal from './OrderDetailsModal';

const OrderHistoryTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchHistoryOrders();
    }, []);

    const fetchHistoryOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .in('status', ['ready', 'completed', 'cancelled', 'printed']) // Include 'printed' as it's a final state for some flows? Or maybe just everything not pending.
            // Actually, user said: "Ne montrer que les statuts finaux (ready, delivered, printed, cancelled)."
            .order('created_at', { ascending: false })
            .limit(100); // Limit to 100 for now to avoid performance issues

        if (error) {
            console.error('Error fetching history:', error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ready': return <span className="px-2 py-1 rounded bg-green-500/20 text-green-500 text-xs font-bold uppercase border border-green-500/30">Prêt</span>;
            case 'completed': return <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-500 text-xs font-bold uppercase border border-blue-500/30">Terminé</span>;
            case 'delivered': return <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-500 text-xs font-bold uppercase border border-purple-500/30">Livré</span>;
            case 'cancelled': return <span className="px-2 py-1 rounded bg-red-500/20 text-red-500 text-xs font-bold uppercase border border-red-500/30">Annulé</span>;
            case 'printed': return <span className="px-2 py-1 rounded bg-gray-500/20 text-gray-400 text-xs font-bold uppercase border border-gray-500/30">Imprimé</span>;
            default: return <span className="px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs font-bold uppercase">{status}</span>;
        }
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'delivery': return <span className="text-orange-400 font-bold">Livraison</span>;
            case 'takeaway': return <span className="text-blue-400 font-bold">Emporté</span>;
            case 'dine_in': return <span className="text-green-400 font-bold">Sur Place</span>;
            default: return <span className="text-gray-400">{type}</span>;
        }
    };

    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();

        // Search by Order Number
        if (order.order_number && order.order_number.toLowerCase().includes(lowerTerm)) return true;

        // Parse customer info for search
        const customerInfo = safeJSONParse(order.customer_info, {});
        const name = customerInfo.name || '';
        const phone = customerInfo.phone || '';

        if (name.toLowerCase().includes(lowerTerm)) return true;
        if (phone.includes(lowerTerm)) return true;

        return false;
    });

    return (
        <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-2xl">
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            {/* Toolbar */}
            <div className="p-4 border-b border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-stone-900/50">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher N°, Client, Tél..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-mitake-gold transition-colors"
                    />
                </div>
                <button
                    onClick={fetchHistoryOrders}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    Actualiser
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-900 text-gray-400 text-xs uppercase tracking-wider border-b border-stone-800">
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">N° Commande</th>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Client</th>
                            <th className="p-4 font-medium text-right">Montant</th>
                            <th className="p-4 font-medium text-center">Statut</th>
                            <th className="p-4 font-medium w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="animate-spin" /> Chargement...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-500">
                                    Aucune commande trouvée.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map(order => {
                                const customerInfo = safeJSONParse(order.customer_info, {});
                                const date = new Date(order.created_at);
                                const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <tr
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="hover:bg-stone-900/50 cursor-pointer transition-colors group"
                                    >
                                        <td className="p-4 text-gray-300 font-mono text-sm whitespace-nowrap">
                                            {formattedDate}
                                        </td>
                                        <td className="p-4 text-white font-bold font-mono">
                                            {order.order_number ? order.order_number.slice(-4) : '????'}
                                            <span className="text-gray-600 text-xs ml-2 font-normal hidden lg:inline">{order.order_number}</span>
                                        </td>
                                        <td className="p-4">
                                            {getTypeBadge(order.type)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{customerInfo.name || 'Inconnu'}</span>
                                                <span className="text-gray-500 text-xs">{customerInfo.phone}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right text-mitake-gold font-bold font-mono">
                                            {order.total_price}€
                                        </td>
                                        <td className="p-4 text-center">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="p-4 text-gray-600 group-hover:text-white transition-colors">
                                            <ChevronRight size={18} />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistoryTable;
