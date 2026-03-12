import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, Flame, Leaf, Star, Anchor, Crown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCustomizationModal from './ProductCustomizationModal';

const MenuCard = ({ item }) => {
    const { addToCart, unavailableItems } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isUnavailable = unavailableItems.includes(item.name);

    const handleAdd = (e) => {
        e.stopPropagation();
        if (isUnavailable) return;

        if (item.availableOptions && item.availableOptions.length > 0) {
            setIsModalOpen(true);
        } else {
            addToCart(item, 1, [], e);
        }
    };

    const handleModalConfirm = (product, quantity, options, e) => {
        addToCart(product, quantity, options, e);
    };

    const getTagIconAndStyle = (tag) => {
        switch (tag) {
            case 'spicy':
                return { icon: <Flame size={12} className="text-white" />, style: "bg-gradient-to-br from-red-500 to-orange-600", label: "Épicé" };
            case 'veggie':
            case 'healthy':
                return { icon: <Leaf size={12} className="text-white" />, style: "bg-gradient-to-br from-green-500 to-emerald-700", label: "Végétarien" };
            case 'chef_choice':
            case 'premium':
            case 'signature':
                return { icon: <Crown size={12} className="text-black" />, style: "bg-gradient-to-br from-yellow-300 to-amber-500", label: "Signature" };
            case 'popular':
                return { icon: <Star size={12} className="text-black" />, style: "bg-gradient-to-br from-mitake-gold to-yellow-600", label: "Populaire" };
            case 'seafood':
                return { icon: <Anchor size={12} className="text-white" />, style: "bg-gradient-to-br from-blue-400 to-cyan-600", label: "Mer" };
            default:
                return null;
        }
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-6 rounded-xl border transition-all duration-500 flex flex-col justify-between h-full group backdrop-blur-md relative overflow-hidden ${isUnavailable
                    ? 'bg-black/20 border-white/5 opacity-60 grayscale'
                    : 'bg-black/40 border-white/10 hover:border-mitake-gold/40 hover:bg-black/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1'
                    }`}
            >
                {/* Effet reflet subtil (Glassmorphism) */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-serif font-bold text-lg md:text-xl transition-colors ${isUnavailable ? 'text-gray-500' : 'text-white group-hover:text-mitake-gold'
                                }`}>
                                {item.name}
                            </h3>
                            {/* Tags avec Badges Visuels Améliorés */}
                            {item.tags && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {item.tags.map(tag => {
                                        const tagData = getTagIconAndStyle(tag);
                                        if (!tagData) return null;
                                        return (
                                            <span
                                                key={tag}
                                                title={tagData.label}
                                                className={`flex items-center gap-1 ${tagData.style} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm`}
                                            >
                                                {tagData.icon}
                                                <span className={tagData.style.includes('text-black') ? 'text-black' : 'text-white'}>
                                                    {tagData.label}
                                                </span>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
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
                            className={`h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-mitake-gold hover:text-black transition-all duration-300 transform group-hover:scale-105 px-4 gap-2 ${item.availableOptions ? 'w-auto' : 'w-8 px-0'
                                }`}
                            aria-label="Ajouter au panier"
                        >
                            {item.availableOptions ? (
                                <span className="text-xs font-bold">Personnaliser</span>
                            ) : (
                                <Plus size={16} />
                            )}
                        </button>
                    )}
                </div>
            </motion.div>

            <ProductCustomizationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={item}
                onConfirm={handleModalConfirm}
            />
        </>
    );
};

export default MenuCard;
