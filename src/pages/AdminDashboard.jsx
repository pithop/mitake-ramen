import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { MENU_DATA } from '../data/menu';
import { Save, Power, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const {
        isDeliveryAvailable,
        setIsDeliveryAvailable,
        unavailableItems,
        setUnavailableItems
    } = useCart();

    const [localUnavailable, setLocalUnavailable] = useState([...unavailableItems]);
    const [localDelivery, setLocalDelivery] = useState(isDeliveryAvailable);

    const toggleItemAvailability = (itemTitle) => {
        if (localUnavailable.includes(itemTitle)) {
            setLocalUnavailable(prev => prev.filter(t => t !== itemTitle));
        } else {
            setLocalUnavailable(prev => [...prev, itemTitle]);
        }
    };

    const handleSave = () => {
        setIsDeliveryAvailable(localDelivery);
        setUnavailableItems(localUnavailable);

        // Persist to localStorage
        const stateToSave = {
            delivery: localDelivery,
            stock: localUnavailable
        };
        localStorage.setItem('mitake_admin_state', JSON.stringify(stateToSave));

        alert("Configuration sauvegardée !");
    };

    return (
        <div className="min-h-screen bg-mitake-black text-white p-4 pb-20">
            <div className="max-w-2xl mx-auto space-y-8">
                <header className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h1 className="text-2xl font-serif font-bold text-mitake-gold">Chef Dashboard</h1>
                    <button
                        onClick={handleSave}
                        className="bg-mitake-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
                    >
                        <Save size={18} /> Sauvegarder
                    </button>
                </header>

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
                        {MENU_DATA.menu.map((category) => (
                            <details key={category.categorie} className="group bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                                <summary className="p-4 cursor-pointer font-bold flex justify-between items-center hover:bg-white/10 transition-colors select-none">
                                    {category.categorie}
                                    <span className="text-gray-500 text-sm group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-4 pt-0 space-y-3 bg-black/20">
                                    {category.articles.map((item) => (
                                        <div key={item.titre} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <span className={localUnavailable.includes(item.titre) ? "text-gray-500 line-through" : "text-gray-200"}>
                                                {item.titre}
                                            </span>
                                            <button
                                                onClick={() => toggleItemAvailability(item.titre)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${localUnavailable.includes(item.titre)
                                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                        : 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                    }`}
                                            >
                                                {localUnavailable.includes(item.titre) ? 'ÉPUISÉ' : 'DISPO'}
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
