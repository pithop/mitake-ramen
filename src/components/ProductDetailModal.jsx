import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ShoppingBag, AlertCircle, Flame, Star, Fish, Leaf, ChefHat } from 'lucide-react';
import { useCart } from '../context/CartContext';

const TAG_CONFIG = {
    popular: { label: "Populaire", icon: Star, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    chef_choice: { label: "Choix du Chef", icon: ChefHat, color: "bg-mitake-gold/20 text-mitake-gold border-mitake-gold/30" },
    meat_lover: { label: "Carnivore", icon: Flame, color: "bg-red-500/20 text-red-400 border-red-500/30" },
    spicy: { label: "Épicé", icon: Flame, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    original: { label: "Original", icon: Star, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    seafood: { label: "Fruits de mer", icon: Fish, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    healthy: { label: "Équilibré", icon: Leaf, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    premium: { label: "Premium", icon: Star, color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" }
};

const ProductDetailModal = ({ item, isOpen, onClose }) => {
    const { addToCart, unavailableItems, customPrices } = useCart();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);

    if (!item) return null;

    const isUnavailable = unavailableItems.includes(item.posName || item.name);

    const toggleOption = (opt) => {
        if (selectedOptions.some(o => o.name === opt.name)) {
            setSelectedOptions(prev => prev.filter(o => o.name !== opt.name));
        } else {
            setSelectedOptions(prev => [...prev, opt]);
        }
    };

    const addMultipleOption = (opt) => {
        setSelectedOptions(prev => [...prev, opt]);
    };

    const removeMultipleOption = (optName) => {
        setSelectedOptions(prev => {
            const index = prev.findIndex(o => o.name === optName);
            if (index > -1) {
                const newArr = [...prev];
                newArr.splice(index, 1);
                return newArr;
            }
            return prev;
        });
    };

    const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
    const totalPrice = (item.price + optionsTotal) * quantity;

    const handleAddToCart = (e) => {
        addToCart(item, quantity, selectedOptions, e);
        setSelectedOptions([]);
        setQuantity(1);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md"
                    />

                    {/* Modal - sheet on mobile, centered card on desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 60 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="relative w-full sm:max-w-lg bg-[#0d0d0d] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] sm:border sm:border-white/10 rounded-t-2xl"
                    >
                        {/* Close button — always visible */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-30 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white/70 hover:text-white transition-colors border border-white/10"
                        >
                            <X size={20} />
                        </button>

                        {/* Hero Image */}
                        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-black shrink-0">
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black animate-pulse" />
                            )}
                            <img
                                src={item.image}
                                alt={item.name}
                                onLoad={() => setImageLoaded(true)}
                                className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                            {/* Gradient overlay on image bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                            
                            {/* Price badge on image */}
                            <div className="absolute bottom-4 left-5">
                                <span className="text-3xl font-serif font-bold text-mitake-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                    {item.price.toFixed(2)} €
                                </span>
                            </div>
                        </div>

                        {/* Content - scrollable */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                            {/* Title & Tags */}
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-serif text-mitake-offwhite leading-tight mb-3">
                                    {item.name}
                                </h2>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map(tag => {
                                            const config = TAG_CONFIG[tag];
                                            if (!config) return null;
                                            const Icon = config.icon;
                                            return (
                                                <span key={tag} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.color}`}>
                                                    <Icon size={12} />
                                                    {config.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                    {item.longDescription || item.description}
                                </p>
                            </div>

                            {/* Allergens */}
                            {item.allergens && item.allergens.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Allergènes :</span>
                                    {item.allergens.map(a => (
                                        <span key={a} className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Separator */}
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {/* Supplements Section */}
                            {item.availableOptions && item.availableOptions.length > 0 && (
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">
                                        Personnalisez votre commande
                                    </h4>
                                    <div className="space-y-2">
                                        {item.availableOptions.map((opt, idx) => {
                                            const activePrice = customPrices && customPrices[opt.name] !== undefined
                                                ? customPrices[opt.name]
                                                : opt.price;
                                            const dynamicOpt = { ...opt, price: activePrice };
                                            const count = selectedOptions.filter(o => o.name === dynamicOpt.name).length;
                                            const isSelected = count > 0;

                                            if (opt.allowMultiple) {
                                                return (
                                                    <div key={idx} className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${count > 0 ? 'bg-mitake-gold/10 border-mitake-gold/40' : 'bg-white/[0.03] border-white/[0.06]'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-sm ${count > 0 ? 'text-mitake-offwhite' : 'text-gray-400'}`}>
                                                                {dynamicOpt.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {dynamicOpt.price > 0 && (
                                                                <span className="text-mitake-gold text-sm font-medium">
                                                                    + {dynamicOpt.price.toFixed(2)} €
                                                                </span>
                                                            )}
                                                            <div className="flex items-center bg-black/40 rounded border border-white/10 shrink-0">
                                                                <button
                                                                    onClick={() => removeMultipleOption(dynamicOpt.name)}
                                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                                                >−</button>
                                                                <span className="w-6 text-center text-white font-bold text-sm">{count}</span>
                                                                <button
                                                                    onClick={() => addMultipleOption(dynamicOpt)}
                                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                                                >+</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => toggleOption(dynamicOpt)}
                                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${isSelected
                                                        ? 'bg-mitake-gold/10 border-mitake-gold/40'
                                                        : 'bg-white/[0.03] border-white/[0.06] hover:border-white/15'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                                                            ? 'bg-mitake-gold border-mitake-gold'
                                                            : 'border-gray-600'
                                                            }`}>
                                                            {isSelected && (
                                                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className={`text-sm ${isSelected ? 'text-mitake-offwhite' : 'text-gray-400'}`}>
                                                            {dynamicOpt.name}
                                                        </span>
                                                    </div>
                                                    {dynamicOpt.price > 0 && (
                                                        <span className="text-mitake-gold text-sm font-medium">
                                                            + {dynamicOpt.price.toFixed(2)} €
                                                        </span>
                                                    )}
                                                    {dynamicOpt.price === 0 && (
                                                        <span className="text-gray-500 text-xs">Gratuit</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Footer — Add to Cart */}
                        <div className="shrink-0 p-4 sm:p-5 bg-[#0d0d0d] border-t border-white/[0.06]">
                            {isUnavailable ? (
                                <div className="flex items-center justify-center gap-2 py-4 text-red-400 font-bold">
                                    <AlertCircle size={20} />
                                    Actuellement indisponible
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden shrink-0">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3.5 py-3 text-gray-400 hover:text-white transition-colors active:bg-white/10"
                                        >
                                            −
                                        </button>
                                        <span className="px-3 text-white font-bold tabular-nums min-w-[2ch] text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3.5 py-3 text-gray-400 hover:text-white transition-colors active:bg-white/10"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Add to cart button */}
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 py-3.5 bg-mitake-gold text-black font-bold rounded-xl hover:bg-white transition-colors duration-200 flex items-center justify-center gap-2 active:scale-[0.98] transform"
                                    >
                                        <ShoppingBag size={18} />
                                        <span>Ajouter • {totalPrice.toFixed(2)} €</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailModal;
