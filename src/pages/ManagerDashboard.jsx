import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useCart } from '../context/CartContext';
import { MENU_DATA } from '../data/menu';
import { Save, Power, Search, Loader2, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import AdminLogin from '../components/AdminLogin';
import AdminNavbar from '../components/AdminNavbar';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useToast } from '../context/ToastContext';
import { supabase } from '../supabaseClient';

// Lazy load the chart component
const RevenueChart = React.lazy(() => import('../components/RevenueChart'));

const ManagerDashboard = () => {
    const { isAuthenticated, loading: authLoading, login } = useAdminAuth();
    const { addToast } = useToast();
    const {
        isDeliveryAvailable,
        unavailableItems,
        updateSettings
    } = useCart();

    const [localUnavailable, setLocalUnavailable] = useState([...unavailableItems]);
    const [localDelivery, setLocalDelivery] = useState(isDeliveryAvailable);
    const [searchTerm, setSearchTerm] = useState('');

    // KPI Data States
    const [orders, setOrders] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    // Sync local state when global state changes
    useEffect(() => {
        setLocalUnavailable([...unavailableItems]);
        setLocalDelivery(isDeliveryAvailable);
    }, [unavailableItems, isDeliveryAvailable]);

    // Fetch Orders for KPIs
    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        setDataLoading(true);
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
        setDataLoading(false);
    };

    // KPI Calculations
    const kpis = useMemo(() => {
        const today = new Date().toDateString();
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
        startOfWeek.setHours(0, 0, 0, 0);

        let dailyRevenue = 0;
        let weeklyRevenue = 0;

        orders.forEach(order => {
            const orderDate = new Date(order.created_at);
            const orderDateString = orderDate.toDateString();
            const price = parseFloat(order.total_price) || 0;

            // Daily
            if (orderDateString === today) {
                dailyRevenue += price;
            }

            // Weekly
            if (orderDate >= startOfWeek) {
                weeklyRevenue += price;
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
                .reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);

            chartData.push({ name: dateStr, ca: dayRevenue });
        }

        return { dailyRevenue, weeklyRevenue, chartData };
    }, [orders]);

    const toggleItemAvailability = async (itemTitle) => {
        let newUnavailable;
        if (localUnavailable.includes(itemTitle)) {
            newUnavailable = localUnavailable.filter(t => t !== itemTitle);
            addToast(`${itemTitle} est maintenant DISPONIBLE`, 'success');
        } else {
            newUnavailable = [...localUnavailable, itemTitle];
            addToast(`${itemTitle} marqué comme ÉPUISÉ`, 'error');
        }

        // Optimistic Update
        setLocalUnavailable(newUnavailable);

        // Background Save
        await updateSettings(localDelivery, newUnavailable);
    };

    const toggleDelivery = async () => {
        const newDelivery = !localDelivery;

        // Optimistic Update
        setLocalDelivery(newDelivery);

        if (newDelivery) {
            addToast("Livraison ACTIVÉE", 'success');
        } else {
            addToast("Livraison DÉSACTIVÉE", 'info');
        }

        // Background Save
        await updateSettings(newDelivery, localUnavailable);
    };

    if (authLoading) return (
        <div className="min-h-screen bg-mitake-black text-white flex items-center justify-center">
            <Loader2 className="animate-spin text-mitake-gold" size={48} />
        </div>
    );

    if (!isAuthenticated) {
        return <AdminLogin onLogin={login} />;
    }

    // Filter items based on search
    const filteredMenu = MENU_DATA.map(category => ({
        ...category,
        items: category.items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.items.length > 0);

    return (
        <div className="min-h-screen bg-mitake-black text-white pb-20">
            <AdminNavbar />

            <div className="max-w-4xl mx-auto p-4 space-y-8">
                <header className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h1 className="text-2xl font-serif font-bold text-white">Manager Dashboard</h1>
                    {/* Auto-save enabled, no button needed */}
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Save size={12} /> Sauvegarde auto
                    </div>
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

                {/* Master Switch - Delivery */}
                <section className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Power size={20} className={localDelivery ? "text-green-400" : "text-red-400"} />
                                Mode Livraison
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {localDelivery
                                    ? "✅ La livraison est ACTIVÉE sur le site."
                                    : "⛔ La livraison est DÉSACTIVÉE (Message 'Pas de livreur')."}
                            </p>
                        </div>
                        <button
                            onClick={toggleDelivery}
                            className={`w-16 h-9 rounded-full p-1 transition-colors duration-300 ${localDelivery ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                            <div className={`bg-white w-7 h-7 rounded-full shadow-md transform transition-transform duration-300 ${localDelivery ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </section>

                {/* Stock Management */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-xl font-bold border-l-4 border-mitake-gold pl-3">Gestion des Stocks (Le "86")</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher un plat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:border-mitake-gold outline-none w-48 sm:w-64"
                            />
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                        Les articles marqués "ÉPUISÉ" seront grisés sur le menu client.
                    </p>

                    <div className="space-y-4">
                        {filteredMenu.map((category) => (
                            <div key={category.title} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                                <div className="p-4 bg-black/20 font-bold text-mitake-gold border-b border-white/5">
                                    {category.title}
                                </div>
                                <div className="divide-y divide-white/5">
                                    {category.items.map((item) => (
                                        <div key={item.name} className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                                            <span className={`font-medium ${localUnavailable.includes(item.name) ? "text-gray-500 line-through decoration-red-500" : "text-gray-200"}`}>
                                                {item.name}
                                            </span>

                                            <label className="flex items-center cursor-pointer relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={!localUnavailable.includes(item.name)}
                                                    onChange={() => toggleItemAvailability(item.name)}
                                                />
                                                <div className="w-11 h-6 bg-red-500/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/50"></div>
                                                <span className="ml-3 text-sm font-bold w-16 text-center">
                                                    {localUnavailable.includes(item.name) ?
                                                        <span className="text-red-400">ÉPUISÉ</span> :
                                                        <span className="text-green-400">DISPO</span>
                                                    }
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {filteredMenu.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                Aucun plat trouvé pour "{searchTerm}"
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ManagerDashboard;
