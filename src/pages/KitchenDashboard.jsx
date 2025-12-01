import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Clock, CheckCircle, AlertTriangle, Volume2, VolumeX, Flame, Loader2 } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { safeJSONParse } from '../utils/helpers';
import OrderDetailsModal from '../components/OrderDetailsModal';

const KitchenDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Refs for stable access in callbacks
    const soundEnabledRef = useRef(soundEnabled);
    const audioRef = useRef(new Audio('/sounds/ding.mp3'));

    // Update ref when state changes
    useEffect(() => {
        soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    // Fetch initial orders
    useEffect(() => {
        console.log("KitchenDashboard mounted. Fetching orders...");
        fetchOrders();

        // Realtime subscription
        const channel = supabase
            .channel('kitchen-orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('New order received:', payload);
                    const newOrder = payload.new;
                    setOrders(prev => {
                        // Avoid duplicates just in case
                        if (prev.find(o => o.id === newOrder.id)) return prev;
                        return [...prev, newOrder];
                    });
                    playSound();
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('Order updated:', payload);
                    const updatedOrder = payload.new;

                    setOrders(prev => {
                        // If status changed to ready/completed/cancelled, remove it
                        if (['ready', 'completed', 'cancelled'].includes(updatedOrder.status)) {
                            return prev.filter(o => o.id !== updatedOrder.id);
                        }
                        // Otherwise update it
                        return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
                    });
                }
            )
            .subscribe((status) => {
                console.log("Supabase subscription status:", status);
            });

        // Timer for updating "time ago" every minute
        const timerInterval = setInterval(() => {
            setOrders(prev => [...prev]); // Force re-render
        }, 60000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(timerInterval);
        };
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        console.log("Fetching orders from Supabase...");
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .neq('status', 'ready')
            .neq('status', 'completed')
            .neq('status', 'cancelled')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            console.log("Orders fetched successfully:", data);
            setOrders(data || []);
        }
        setLoading(false);
    };

    const playSound = () => {
        // Use ref to get current value inside closure
        if (soundEnabledRef.current && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Error playing sound:", e));
        }
    };

    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        // Try to play silent sound to unlock audio context on mobile/browsers
        if (newState && audioRef.current) {
            audioRef.current.play().catch(() => { });
        }
    };

    const markAsReady = async (orderId) => {
        // Optimistic update
        setOrders(prev => prev.filter(o => o.id !== orderId));

        const { error } = await supabase
            .from('orders')
            .update({ status: 'ready' })
            .eq('id', orderId);

        if (error) {
            console.error('Error updating order:', error);
            alert("Erreur lors de la mise à jour de la commande.");
            fetchOrders(); // Revert on error
        }
    };

    const getElapsedTime = (dateString) => {
        const start = new Date(dateString);
        const now = new Date();
        const diffMs = now - start;
        const diffMins = Math.floor(diffMs / 60000);
        return diffMins;
    };

    const getCardColor = (mins) => {
        if (mins < 10) return 'bg-white text-black';
        if (mins < 20) return 'bg-yellow-400 text-black';
        return 'bg-red-500 text-white';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-mitake-black text-white flex flex-col items-center justify-center gap-4">
                <AdminNavbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 size={48} className="animate-spin text-mitake-gold" />
                    <p className="text-gray-400 animate-pulse">Chargement des commandes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mitake-black text-white pb-20">
            <AdminNavbar />

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <div className="p-4">
                {/* Header */}
                <header className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-serif font-bold text-mitake-gold flex items-center gap-3">
                        <Flame className="text-orange-500" />
                        Cuisine (KDS)
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">{orders.length} Commandes</span>
                        <button
                            onClick={toggleSound}
                            className={`p-3 rounded-full transition-colors ${soundEnabled ? 'bg-green-500 text-black' : 'bg-red-500/20 text-red-500'}`}
                            title={soundEnabled ? "Son activé" : "Son désactivé"}
                        >
                            {soundEnabled ? <Volume2 /> : <VolumeX />}
                        </button>
                    </div>
                </header>

                {/* Empty State */}
                {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 space-y-4">
                        <div className="bg-white/5 p-8 rounded-full">
                            <Flame size={64} className="text-mitake-gold opacity-50" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Aucune commande en cours 👨‍🍳</h2>
                        <p>La cuisine est calme... Prêt pour le feu ! 🔥</p>
                    </div>
                )}

                {/* Orders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {orders.map(order => {
                        const elapsedMins = getElapsedTime(order.created_at);
                        const cardColorClass = getCardColor(elapsedMins);
                        const isLate = elapsedMins >= 20;

                        const items = safeJSONParse(order.items, []);
                        const customerInfo = safeJSONParse(order.customer_info, {});

                        return (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`rounded-xl overflow-hidden shadow-lg flex flex-col ${cardColorClass} cursor-pointer hover:scale-[1.02] transition-transform duration-200`}
                            >
                                {/* Card Header */}
                                <div className="p-4 border-b border-black/10 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black">#{order.order_number ? order.order_number.slice(-4) : '????'}</h3>
                                        <p className="text-sm font-bold opacity-80 uppercase">
                                            {order.type === 'dine_in' ? 'Sur Place' :
                                                order.type === 'takeaway' ? 'À Emporter' : 'Livraison'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1 font-mono font-bold text-lg">
                                            <Clock size={18} />
                                            {elapsedMins} min
                                        </div>
                                        {isLate && <AlertTriangle size={20} className="animate-bounce mt-1" />}
                                    </div>
                                </div>

                                {/* Card Body - Items */}
                                <div className="p-4 flex-1 overflow-y-auto max-h-[400px]">
                                    {/* Customer Info / Notes */}
                                    {customerInfo && customerInfo.notes && (
                                        <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-600 text-red-800 text-sm font-bold rounded">
                                            ⚠️ NOTE: {customerInfo.notes}
                                        </div>
                                    )}

                                    <ul className="space-y-3">
                                        {items.length === 0 && <li className="text-sm italic opacity-50">Aucun article (Erreur de parsing ?)</li>}
                                        {items.map((item, idx) => (
                                            <li key={idx} className="border-b border-black/5 last:border-0 pb-2 last:pb-0">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-bold text-lg leading-tight">
                                                        {item.quantity}x {item.name}
                                                    </span>
                                                </div>

                                                {/* Options */}
                                                {item.options && item.options.length > 0 && (
                                                    <div className="mt-1 pl-4 text-sm font-semibold opacity-80 space-y-0.5">
                                                        {item.options.map((opt, i) => (
                                                            <div key={i} className="flex items-center gap-1">
                                                                <span>+ {opt.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Kitchen Note per item */}
                                                {item.comment && (
                                                    <p className="text-red-700 font-bold text-sm mt-1 pl-4">
                                                        📝 {item.comment}
                                                    </p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Card Footer - Action */}
                                <div className="p-4 bg-black/5 mt-auto">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsReady(order.id);
                                        }}
                                        className="w-full py-4 bg-black text-white font-bold text-xl rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95 transform duration-100"
                                    >
                                        <CheckCircle />
                                        TERMINE
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default KitchenDashboard;
