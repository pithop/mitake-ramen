import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useCart } from '../context/CartContext';
import { MENU_DATA } from '../data/menu';
import { Save, Power, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import AdminLogin from '../components/AdminLogin';
import { supabase } from '../supabaseClient';

// Lazy load the chart component
const RevenueChart = React.lazy(() => import('../components/RevenueChart'));

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const {
        isDeliveryAvailable,
        unavailableItems,
        updateSettings // New function from context
    } = useCart();

    const [localUnavailable, setLocalUnavailable] = useState([...unavailableItems]);
    const [localDelivery, setLocalDelivery] = useState(isDeliveryAvailable);

    // Sync local state when global state changes (e.g. from other admins or initial load)
    useEffect(() => {
        setLocalUnavailable([...unavailableItems]);
        setLocalDelivery(isDeliveryAvailable);
    }, [unavailableItems, isDeliveryAvailable]);

    // Data States
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Orders on Auth
    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        setLoading(true);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    // KPI Calculations
    const kpis = useMemo(() => {
        const today = new Date().toDateString();
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
        startOfWeek.setHours(0, 0, 0, 0);

        let dailyRevenue = 0;
        let weeklyRevenue = 0;
        const dailyOrders = [];

        orders.forEach(order => {
            const orderDate = new Date(order.created_at);
            const orderDateString = orderDate.toDateString();

            // Daily
            if (orderDateString === today) {
                dailyRevenue += order.total_price || 0;
                dailyOrders.push(order);
            }

            // Weekly
            if (orderDate >= startOfWeek) {
                weeklyRevenue += order.total_price || 0;
            }
        });

        // Chart Data (Last 7 Days)
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
            const dayRevenue = orders
                .filter(o => new Date(o.created_at).toDateString() === d.toDateString())
                .reduce((sum, o) => sum + (o.total_price || 0), 0);

            chartData.push({ name: dateStr, ca: dayRevenue });
        }

        return { dailyRevenue, weeklyRevenue, chartData };
    }, [orders]);

    const toggleItemAvailability = (itemTitle) => {
        if (localUnavailable.includes(itemTitle)) {
            setLocalUnavailable(prev => prev.filter(t => t !== itemTitle));
        } else {
            setLocalUnavailable(prev => [...prev, itemTitle]);
        }
    };

    const handleSave = async () => {
        await updateSettings(localDelivery, localUnavailable);
        alert("Configuration sauvegardée et synchronisée !");
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-mitake-black text-white p-4 pb-20">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h1 className="text-2xl font-serif font-bold text-mitake-gold">Chef Dashboard</h1>
                    <button
                        onClick={handleSave}
                        className="bg-mitake-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
                    >
                        <Save size={18} /> Sauvegarder
                    </button>
                </header>

                {/* KPIs */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">CA du Jour</p>
                            <p className="text-3xl font-bold text-mitake-gold">{kpis.dailyRevenue.toFixed(2)}€</p>
                        </div>
                        <div className="p-3 bg-mitake-gold/10 rounded-full">
                            <DollarSign className="text-mitake-gold" size={24} />
                        </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">CA Semaine</p>
                            <p className="text-3xl font-bold text-white">{kpis.weeklyRevenue.toFixed(2)}€</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-full">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>
                </section>

                {/* Chart */}
                <section className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-mitake-gold" />
                        Performance (7 derniers jours)
                    </h2>
                    <Suspense fallback={<div className="h-64 w-full flex items-center justify-center text-gray-500">Chargement du graphique...</div>}>
                        <RevenueChart data={kpis.chartData} />
                    </Suspense>
                </section>

                {/* Master Switch */}
                <section className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Power size={20} className={localDelivery ? "text-green-400" : "text-red-400"} />
                                Mode Livraison
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {localDelivery ? "Les clients peuvent commander en livraison." : "Livraison désactivée (message 'Pas de livreur')."}
                            </p>
                        </div>
                        <button
                            onClick={() => setLocalDelivery(!localDelivery)}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${localDelivery ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${localDelivery ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </section>

                {/* Stock Management */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold border-l-4 border-mitake-gold pl-3">Gestion des Stocks</h2>
                    <p className="text-gray-400 text-sm mb-4">Cochez les articles en rupture de stock.</p>

                    <div className="space-y-2">
                        {MENU_DATA.map((category) => (
                            <details key={category.title} className="group bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                                <summary className="p-4 cursor-pointer font-bold flex justify-between items-center hover:bg-white/10 transition-colors select-none">
                                    {category.title}
                                    <span className="text-gray-500 text-sm group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-4 pt-0 space-y-3 bg-black/20">
                                    {category.items.map((item) => (
                                        <div key={item.name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <span className={localUnavailable.includes(item.name) ? "text-gray-500 line-through" : "text-gray-200"}>
                                                {item.name}
                                            </span>
                                            <button
                                                onClick={() => toggleItemAvailability(item.name)}
                                                className={`px - 3 py - 1 rounded - full text - xs font - bold transition - colors ${localUnavailable.includes(item.name)
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                    : 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                    } `}
                                            >
                                                {localUnavailable.includes(item.name) ? 'ÉPUISÉ' : 'DISPO'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
