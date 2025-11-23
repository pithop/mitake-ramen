import React from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MenuCard = ({ item }) => {
    const { addToCart, unavailableItems } = useCart();
    const isUnavailable = unavailableItems.includes(item.name);

    const handleAdd = (e) => {
        e.stopPropagation();
        if (!isUnavailable) {
            addToCart(item);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`bg-black/50 p-6 rounded-sm border transition-all duration-300 flex flex-col justify-between h-full group backdrop-blur-sm relative overflow-hidden ${isUnavailable
                ? 'border-white/5 opacity-60 grayscale'
                : 'border-white/10 hover:border-mitake-gold/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                }`}
        >
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-serif font-bold text-lg transition-colors ${isUnavailable ? 'text-gray-500' : 'text-white group-hover:text-mitake-gold'
                        }`}>
                        {item.name}
                    </h3>
                    <span className={`font-medium whitespace-nowrap ml-4 ${isUnavailable ? 'text-gray-600' : 'text-mitake-gold'
                        }`}>
                        {item.price.toFixed(2)} €
                    </span>
                </div>
                {item.description && (
                    <p className="text-gray-400 text-sm font-light line-clamp-3 leading-relaxed group-hover:text-gray-300 transition-colors">
                        {item.description}
                    </p>
                )}
            </div>

            {/* Add Button */}
            <div className="mt-4 flex justify-end">
                {isUnavailable ? (
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 border border-red-500/30 px-2 py-1 rounded">
                        <AlertCircle size={12} /> ÉPUISÉ
                    </span>
                ) : (
                    <button
                        onClick={handleAdd}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-mitake-gold hover:text-black transition-all duration-300 transform group-hover:scale-110"
                        aria-label="Ajouter au panier"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default MenuCard;
