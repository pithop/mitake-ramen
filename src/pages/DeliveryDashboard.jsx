import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MapPin, Phone, CheckCircle, Truck, Package, Navigation, Loader2, Zap, Map as MapIcon, TrendingUp, X, Clock, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '../components/AdminNavbar';
import { useToast } from '../context/ToastContext';
import { safeJSONParse } from '../utils/helpers';
import OrderDetailsModal from '../components/OrderDetailsModal';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flashlightMode, setFlashlightMode] = useState(false);
    const [dailyStats, setDailyStats] = useState({ count: 0, earnings: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { addToast } = useToast();

    console.log("DeliveryDashboard rendering...");
    console.log("Total orders:", orders.length); // Debug text

    // Fetch initial orders and stats
    useEffect(() => {
        console.log("DeliveryDashboard mounted");
        fetchDeliveryOrders();
        fetchDailyStats();

        // Realtime subscription
        const channel = supabase
            .channel('delivery-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log("Realtime payload:", payload);
                    const newOrUpdated = payload.new;

                    if (payload.eventType === 'INSERT') {
                        if (newOrUpdated.type === 'delivery' && ['ready', 'delivering'].includes(newOrUpdated.status)) {
                            setOrders(prev => [...prev, newOrUpdated]);
                            addToast("Nouvelle commande à livrer !", "info");
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        // Check if it should be in the list
                        const isRelevant = newOrUpdated.type === 'delivery' && ['ready', 'delivering'].includes(newOrUpdated.status);

                        setOrders(prev => {
                            if (isRelevant) {
                                // Update or Add
                                const exists = prev.find(o => o.id === newOrUpdated.id);
                                if (exists) {
                                    return prev.map(o => o.id === newOrUpdated.id ? newOrUpdated : o);
                                } else {
                                    addToast("Nouvelle commande prête !", "success");
                                    return [...prev, newOrUpdated];
                                }
                            } else {
                                // Remove if it was there (e.g. status changed to delivered or cancelled)
                                const wasThere = prev.find(o => o.id === newOrUpdated.id);
                                if (wasThere && newOrUpdated.status === 'delivered') {
                                    fetchDailyStats(); // Update stats if delivered
                                }
                                return prev.filter(o => o.id !== newOrUpdated.id);
                            }
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchDeliveryOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('type', 'delivery')
            .in('status', ['ready', 'delivering'])
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching delivery orders:', error);
        } else {
            console.log("Orders fetched:", data);
            setOrders(data || []);
        }
        setLoading(false);
    };

    const fetchDailyStats = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count, error } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('type', 'delivery')
            .eq('status', 'delivered')
            .gte('created_at', today.toISOString());

        if (!error) {
            setDailyStats({
                count: count || 0,
                earnings: (count || 0) * 5 // 5€ per delivery
            });
        }
    };

    const updateStatus = async (e, orderId, newStatus) => {
        e.stopPropagation(); // Prevent opening modal

        // Optimistic update
        if (newStatus === 'delivered') {
            setOrders(prev => prev.filter(o => o.id !== orderId));
            addToast("Commande livrée !", "success");
            setDailyStats(prev => ({
                count: prev.count + 1,
                earnings: prev.earnings + 5
            }));
        } else {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            addToast("Commande prise en charge", "info");
        }

        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            alert("Erreur lors de la mise à jour.");
            fetchDeliveryOrders(); // Revert
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-mitake-black text-white flex flex-col items-center justify-center gap-4">
                <AdminNavbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 size={48} className="animate-spin text-mitake-gold" />
                    <p className="text-gray-400 animate-pulse">Chargement des livraisons...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mitake-black text-white pb-20 relative">
            <AdminNavbar />

            {/* Flashlight Overlay */}
            {flashlightMode && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <button
                        onClick={() => setFlashlightMode(false)}
                        className="absolute bottom-20 bg-black/80 text-white p-6 rounded-full shadow-2xl active:scale-95 transition-transform"
                    >
                        <Zap size={48} fill="currentColor" />
                    </button>
                    <p className="text-black font-bold text-xl mt-4 opacity-50">Mode Torche Activé</p>
                    <p className="text-black text-sm opacity-30">Touchez le bouton pour éteindre</p>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <div className="max-w-lg mx-auto p-4 space-y-6">
                {/* Header & Stats */}
                <header className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
                                <Truck className="text-mitake-gold" size={32} />
                                Espace Livreur
                            </h1>
                            <p className="text-gray-400">
                                {orders.length} commande(s) en attente
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchDeliveryOrders}
                                className="bg-white/10 p-3 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
                                title="Actualiser"
                            >
                                <RefreshCw size={24} className="text-blue-400" />
                            </button>
                            <button
                                onClick={() => setFlashlightMode(true)}
                                className="bg-white/10 p-3 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
                                title="Mode Torche"
                            >
                                <Zap size={24} className="text-yellow-400" />
                            </button>
                        </div>
                    </div>

                    {/* Daily Stats Card */}
                    <div className="bg-gradient-to-r from-mitake-gold/20 to-orange-500/20 border border-mitake-gold/30 rounded-xl p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-mitake-gold/20 p-2 rounded-lg">
                                <TrendingUp size={24} className="text-mitake-gold" />
                            </div>
                            <div>
                                <p className="text-xs text-mitake-gold uppercase font-bold">Aujourd'hui</p>
                                <p className="text-xl font-bold text-white">{dailyStats.count} Livraisons</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-bold">Gains Estimés</p>
                            <p className="text-2xl font-black text-green-400">{dailyStats.earnings}€</p>
                        </div>
                    </div>
                </header>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
                        <div className="bg-white/5 p-8 rounded-full animate-pulse">
                            <Package size={64} className="opacity-30" />
                        </div>
                        <p className="text-xl font-medium text-center">Aucune livraison en attente 🛵</p>
                        <p className="text-sm opacity-50">Profitez-en pour faire une pause !</p>
                        <button onClick={fetchDeliveryOrders} className="text-mitake-gold underline">Actualiser</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {orders.map(order => {
                                const customerInfo = safeJSONParse(order.customer_info, {});
                                const items = safeJSONParse(order.items, []);
                                const address = customerInfo.address || '';
                                const encodedAddress = encodeURIComponent(address);

                                return (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`rounded-2xl overflow-hidden shadow-xl border cursor-pointer active:scale-[0.98] transition-transform ${order.status === 'delivering'
                                            ? 'bg-blue-900/20 border-blue-500/50'
                                            : 'bg-white/5 border-white/10'
                                            }`}
                                    >
                                        {/* Card Header */}
                                        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-white/10 text-white font-mono font-bold px-2 py-1 rounded text-sm">
                                                    #{order.order_number.slice(-4)}
                                                </span>
                                                <span className="text-sm text-gray-400 flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'delivering'
                                                ? 'bg-blue-500 text-white animate-pulse'
                                                : 'bg-green-500 text-black'
                                                }`}>
                                                {order.status === 'delivering' ? 'En cours' : 'Prêt'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 space-y-5">
                                            {/* Address & Navigation */}
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="text-mitake-gold shrink-0 mt-1" size={24} />
                                                    <div>
                                                        <p className="font-bold text-xl leading-tight text-white">
                                                            {customerInfo.name || 'Client'}
                                                        </p>
                                                        <p className="text-gray-300 text-lg mt-1">
                                                            {address || 'Adresse non renseignée'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Navigation Buttons */}
                                                {address && (
                                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                                        <a
                                                            href={`https://waze.com/ul?q=${encodedAddress}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={e => e.stopPropagation()}
                                                            className="flex items-center justify-center gap-2 bg-[#33CCFF]/10 text-[#33CCFF] border border-[#33CCFF]/30 py-3 rounded-xl font-bold hover:bg-[#33CCFF]/20 transition-colors"
                                                        >
                                                            <Navigation size={18} />
                                                            Waze
                                                        </a>
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={e => e.stopPropagation()}
                                                            className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors"
                                                        >
                                                            <MapIcon size={18} />
                                                            Maps
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Phone */}
                                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                                <div className="bg-green-500/20 p-2 rounded-full">
                                                    <Phone size={20} className="text-green-500" />
                                                </div>
                                                <a
                                                    href={`tel:${customerInfo.phone}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className="text-lg font-bold text-white flex-1"
                                                >
                                                    {customerInfo.phone || 'Non renseigné'}
                                                </a>
                                                <span className="text-xs text-gray-500 uppercase font-bold">Appeler</span>
                                            </div>

                                            {/* Items Preview */}
                                            <div className="text-sm text-gray-400 pl-2 border-l-2 border-white/10">
                                                {items.length} article(s) • {order.total_price}€
                                            </div>
                                        </div>

                                        {/* Big Action Button */}
                                        <div className="p-4 pt-0">
                                            {order.status === 'ready' ? (
                                                <button
                                                    onClick={(e) => updateStatus(e, order.id, 'delivering')}
                                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                                                >
                                                    <Truck size={24} />
                                                    GO !
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => updateStatus(e, order.id, 'delivered')}
                                                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black text-xl rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                                                >
                                                    <CheckCircle size={24} />
                                                    LIVRÉ
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryDashboard;
