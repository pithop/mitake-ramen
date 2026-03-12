import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, CheckCircle, AlertTriangle, Volume2, VolumeX, Flame, Loader2, History, LayoutGrid } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { safeJSONParse } from '../utils/helpers';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderHistoryTable from '../components/OrderHistoryTable';

const KitchenDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
    const [flashingOrder, setFlashingOrder] = useState(null);

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
                    setFlashingOrder(newOrder.id);
                    setTimeout(() => setFlashingOrder(null), 3000); // flash for 3 seconds
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
                        // If status changed to completed/cancelled, remove it
                        if (['completed', 'cancelled'].includes(updatedOrder.status)) {
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
            .in('status', ['pending', 'pending_print', 'preparing', 'ready'])
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const filteredData = (data || []).filter(order => {
                if (order.status === 'ready') {
                    const orderDate = new Date(order.created_at);
                    return orderDate >= today; // Only show today's ready orders
                }
                return true;
            });

            console.log("Orders fetched successfully:", filteredData);
            setOrders(filteredData);
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
                <header className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-white/10 pb-4 gap-4">
                    <div className="flex items-center gap-6">
                        <h1 className="text-3xl font-serif font-bold text-mitake-gold flex items-center gap-3">
                            <Flame className="text-orange-500" />
                            Cuisine (KDS)
                        </h1>

                        {/* Tabs */}
                        <div className="flex bg-white/10 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-4 py-2 rounded-md flex items-center gap-2 font-bold transition-all ${activeTab === 'active'
                                    ? 'bg-mitake-gold text-black shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <LayoutGrid size={18} />
                                En Cours
                                {orders.length > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {orders.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-4 py-2 rounded-md flex items-center gap-2 font-bold transition-all ${activeTab === 'history'
                                    ? 'bg-mitake-gold text-black shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <History size={18} />
                                Historique
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSound}
                            className={`p-3 rounded-full transition-colors ${soundEnabled ? 'bg-green-500 text-black' : 'bg-red-500/20 text-red-500'}`}
                            title={soundEnabled ? "Son activé" : "Son désactivé"}
                        >
                            {soundEnabled ? <Volume2 /> : <VolumeX />}
                        </button>
                    </div>
                </header>

                {/* Content */}
                {activeTab === 'active' ? (
                    <>
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

                        {/* Kanban Board */}
                        {orders.length > 0 && (
                            <DragDropContext
                                onDragEnd={async (result) => {
                                    const { destination, source, draggableId } = result;
                                    if (!destination) return;
                                    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

                                    const newStatus = destination.droppableId;

                                    // Optimistic update
                                    setOrders(prev => prev.map(o => o.id === draggableId ? { ...o, status: newStatus } : o));

                                    const { error } = await supabase
                                        .from('orders')
                                        .update({ status: newStatus })
                                        .eq('id', draggableId);

                                    if (error) {
                                        console.error('Error updating status:', error);
                                        fetchOrders(); // Revert on error
                                    }
                                }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
                                    {[
                                        { id: 'pending_print', title: 'Nouvelles 📥', color: 'border-mitake-gold' },
                                        { id: 'preparing', title: 'En Préparation 🔪', color: 'border-blue-500' },
                                        { id: 'ready', title: 'Prêtes ✨', color: 'border-green-500' }
                                    ].map(column => {
                                        const columnOrders = orders.filter(o =>
                                            column.id === 'pending_print'
                                                ? (o.status === 'pending_print' || o.status === 'pending')
                                                : o.status === column.id
                                        );

                                        return (
                                            <div key={column.id} className="bg-white/5 rounded-xl border border-white/10 flex flex-col h-[75vh]">
                                                <div className={`p-4 border-b-2 ${column.color} bg-black/40`}>
                                                    <h2 className="font-bold text-lg flex items-center justify-between">
                                                        {column.title}
                                                        <span className="bg-white/10 px-2 py-0.5 rounded-full text-sm">{columnOrders.length}</span>
                                                    </h2>
                                                </div>

                                                <Droppable droppableId={column.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                            className={`flex-1 p-4 overflow-y-auto space-y-4 transition-colors ${snapshot.isDraggingOver ? 'bg-white/5' : ''}`}
                                                        >
                                                            {columnOrders.map((order, index) => {
                                                                const elapsedMins = getElapsedTime(order.created_at);
                                                                const cardColorClass = getCardColor(elapsedMins);
                                                                const isLate = elapsedMins >= 20;

                                                                const items = safeJSONParse(order.items, []);
                                                                const customerInfo = safeJSONParse(order.customer_info, {});

                                                                const isFlashing = flashingOrder === order.id;

                                                                return (
                                                                    <Draggable key={order.id} draggableId={order.id} index={index}>
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                onClick={() => setSelectedOrder(order)}
                                                                                style={{ ...provided.draggableProps.style }}
                                                                                className={`rounded-xl overflow-hidden shadow-lg flex flex-col ${cardColorClass} cursor-pointer transition-transform duration-200 ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl z-50' : 'hover:scale-[1.02]'} ${isFlashing ? 'animate-pulse ring-4 ring-mitake-gold' : ''}`}
                                                                            >
                                                                                {/* Card Header */}
                                                                                <div className={`p-3 border-b border-black/10 flex justify-between items-start ${isFlashing ? 'bg-mitake-gold text-black' : ''}`}>
                                                                                    <div>
                                                                                        <h3 className="text-xl font-black">#{order.order_number ? order.order_number.slice(-4) : '????'}</h3>
                                                                                        <p className="text-xs font-bold opacity-80 uppercase">
                                                                                            {order.type === 'dine_in' ? 'Sur Place' :
                                                                                                order.type === 'takeaway' ? 'À Emporter' : 'Livraison'}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="flex flex-col items-end">
                                                                                        <div className="flex items-center gap-1 font-mono font-bold text-base">
                                                                                            <Clock size={16} />
                                                                                            {elapsedMins}m
                                                                                        </div>
                                                                                        {isLate && <AlertTriangle size={16} className="animate-bounce mt-1" />}
                                                                                    </div>
                                                                                </div>

                                                                                {/* Card Body - Items */}
                                                                                <div className="p-3 flex-1">
                                                                                    {/* Customer Info / Notes */}
                                                                                    {customerInfo && customerInfo.notes && (
                                                                                        <div className="mb-3 p-2 bg-red-100 border-l-4 border-red-600 text-red-800 text-xs font-bold rounded">
                                                                                            ⚠️ NOTE: {customerInfo.notes}
                                                                                        </div>
                                                                                    )}

                                                                                    <ul className="space-y-2">
                                                                                        {items.length === 0 && <li className="text-xs italic opacity-50">Aucun article</li>}
                                                                                        {items.map((item, idx) => (
                                                                                            <li key={idx} className="border-b border-black/5 last:border-0 pb-1 last:pb-0">
                                                                                                <div className="flex justify-between items-start">
                                                                                                    <span className="font-bold text-sm leading-tight">
                                                                                                        {item.quantity}x {item.name}
                                                                                                    </span>
                                                                                                </div>

                                                                                                {/* Options */}
                                                                                                {item.options && item.options.length > 0 && (
                                                                                                    <div className="mt-0.5 pl-2 text-xs font-semibold opacity-80 space-y-0.5">
                                                                                                        {item.options.map((opt, i) => (
                                                                                                            <div key={i} className="flex items-center gap-1">
                                                                                                                <span>+ {opt.name}</span>
                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Kitchen Note per item */}
                                                                                                {item.comment && (
                                                                                                    <p className="text-red-700 font-bold text-xs mt-0.5 pl-2">
                                                                                                        📝 {item.comment}
                                                                                                    </p>
                                                                                                )}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        );
                                    })}
                                </div>
                            </DragDropContext>
                        )}
                    </>
                ) : (
                    <OrderHistoryTable />
                )}
            </div>
        </div>
    );
};

export default KitchenDashboard;
