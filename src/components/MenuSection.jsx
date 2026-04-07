import React, { useState } from 'react';
import { MENU_DATA } from '../data/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import yakitoriImage from '../assets/section-yakitori.png';
import ramenChashuImage from '../assets/ramen-chashu.png';
import sushiImage from '../assets/section-sushi.png';
import { useCart } from '../context/CartContext';

const MenuSection = () => {
    const [activeTab, setActiveTab] = useState('atelier');
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOptionsModal, setSelectedOptionsModal] = useState([]);
    const { addToCart, unavailableItems, customPrices } = useCart();

    const getCategories = (tab) => {
        switch (tab) {
            case 'atelier':
                return ['NOS RAMENS AUTHENTIQUES', 'TAPAS & GYOZAS', 'PLATS CHAUDS & DONBURI'];
            case 'comptoir':
                return ['LE COMPTOIR SUSHI (KYO)'];
            default:
                return [];
        }
    };

    const activeCategories = getCategories(activeTab);
    // MENU_DATA is now an array directly, not an object with a menu property
    const filteredMenu = MENU_DATA.filter(cat => activeCategories.includes(cat.title));

    // Reset expanded category when tab changes
    React.useEffect(() => {
        if (filteredMenu.length > 0) {
            setExpandedCategory(filteredMenu[0].title);
        } else {
            setExpandedCategory(null);
        }
    }, [activeTab]);

    const toggleCategory = (categoryName) => {
        if (expandedCategory === categoryName) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryName);
        }
    };

    return (
        <section id="menu" className="min-h-screen bg-mitake-black relative z-10 py-10 md:py-20">
            {/* Content Area */}
            <div className="relative min-h-[60vh]">
                <div className="flex flex-col lg:flex-row">
                    {/* Sticky Image Left */}
                    <div className="w-full lg:w-1/2 h-[30vh] md:h-[40vh] lg:h-auto lg:min-h-[60vh] lg:sticky lg:top-32 overflow-hidden self-start z-0 group">
                        <div className="relative w-full h-full min-h-[30vh] overflow-hidden">
                            <img
                                src={ramenChashuImage}
                                alt="Bol de Ramen Tonkotsu Cha-shu"
                                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-mitake-black pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Menu List Right (Accordions) */}
                    <div className="w-full lg:w-1/2 p-4 md:p-6 lg:p-16 bg-mitake-black relative z-10">
                        <div className="space-y-4 md:space-y-6">
                            {filteredMenu.map((category, idx) => (
                                <div key={idx} className="border-b border-white/10 pb-4">
                                    <button
                                        onClick={() => toggleCategory(category.title)}
                                        className="w-full flex justify-between items-center py-4 md:py-5 group min-h-[60px] touch-manipulation"
                                    >
                                        <h3 className="text-xl md:text-3xl font-serif text-mitake-offwhite group-hover:text-mitake-gold transition-colors duration-300 italic text-left">
                                            {category.title}
                                        </h3>
                                        <div className="text-mitake-gold/70 group-hover:text-mitake-gold transition-colors flex-shrink-0 ml-4">
                                            {expandedCategory === category.title ? <Minus size={24} className="md:w-7 md:h-7" /> : <Plus size={24} className="md:w-7 md:h-7" />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {expandedCategory === category.title && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <motion.div
                                                    className="space-y-4 py-4 md:py-6"
                                                    variants={{
                                                        hidden: { opacity: 0 },
                                                        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                                                    }}
                                                    initial="hidden"
                                                    animate="show"
                                                >
                                                    {category.items.map((item, i) => {
                                                        const isUnavailable = unavailableItems.includes(item.posName || item.name);

                                                        return (
                                                            <motion.div
                                                                variants={{
                                                                    hidden: { opacity: 0, y: 20 },
                                                                    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                                                                }}
                                                                key={i}
                                                                className={`group/item relative p-4 md:p-5 rounded-lg border transition-all duration-300 ${isUnavailable
                                                                    ? 'bg-black/20 border-white/5 opacity-60'
                                                                    : 'bg-black/30 border-white/10 hover:border-mitake-gold/30 hover:bg-black/40'
                                                                    }`}
                                                            >
                                                                <div className="flex justify-between items-start gap-3 md:gap-4">
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className={`text-base md:text-lg font-medium mb-2 ${isUnavailable
                                                                            ? 'text-gray-500'
                                                                            : 'text-mitake-offwhite group-hover/item:text-mitake-gold transition-colors duration-300'
                                                                            }`}>
                                                                            {item.name}
                                                                        </h4>
                                                                        {item.description && (
                                                                            <p className="text-sm md:text-base text-gray-400 mt-1 font-light leading-relaxed">
                                                                                {item.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                                                        <span className={`font-serif text-base md:text-lg font-bold ${isUnavailable ? 'text-gray-600' : 'text-mitake-gold'
                                                                            }`}>
                                                                            {item.price.toFixed(2)} €
                                                                        </span>
                                                                        {isUnavailable ? (
                                                                            <span className="text-xs font-bold text-red-500 flex items-center gap-1 border border-red-500/30 px-2 py-1 rounded">
                                                                                <AlertCircle size={12} /> ÉPUISÉ
                                                                            </span>
                                                                        ) : (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    if (item.availableOptions && item.availableOptions.length > 0) {
                                                                                        setSelectedItem(item);
                                                                                        setSelectedOptionsModal([]);
                                                                                        setIsModalOpen(true);
                                                                                    } else {
                                                                                        addToCart(item);
                                                                                    }
                                                                                }}
                                                                                className="relative z-20 cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-mitake-gold/10 border-2 border-mitake-gold/30 flex items-center justify-center text-mitake-gold hover:bg-mitake-gold hover:text-black transition-all duration-300 transform hover:scale-110 active:scale-95 touch-manipulation"
                                                                                aria-label="Ajouter au panier"
                                                                            >
                                                                                <Plus size={20} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Options Modal */}
            <AnimatePresence>
                {isModalOpen && selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-mitake-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-start shrink-0">
                                <div>
                                    <h3 className="text-2xl font-serif text-mitake-gold mb-1">{selectedItem.name}</h3>
                                    <p className="text-gray-400 text-sm">Personnalisez votre commande</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-4">
                                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Suppléments (Optionnels)</h4>
                                {selectedItem.availableOptions.map((opt, idx) => {
                                    // Apply custom price if overridden by Admin Manager Dashboard
                                    const activePrice = customPrices && customPrices[opt.name] !== undefined 
                                        ? customPrices[opt.name] 
                                        : opt.price;
                                        
                                    const dynamicOpt = { ...opt, price: activePrice };
                                    const isSelected = selectedOptionsModal.some(o => o.name === dynamicOpt.name);
                                    
                                    return (
                                        <label
                                            key={idx}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (isSelected) {
                                                    setSelectedOptionsModal(prev => prev.filter(o => o.name !== dynamicOpt.name));
                                                } else {
                                                    setSelectedOptionsModal(prev => [...prev, dynamicOpt]);
                                                }
                                            }}
                                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 ${isSelected
                                                ? 'bg-mitake-gold/10 border-mitake-gold/50'
                                                : 'bg-black/30 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-mitake-gold border-mitake-gold' : 'border-gray-500'
                                                    }`}>
                                                    {isSelected && <svg className="w-3 h-3 text-mitake-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className={`text-base ${isSelected ? 'text-mitake-offwhite' : 'text-gray-400'}`}>{dynamicOpt.name}</span>
                                            </div>
                                            <span className="text-mitake-gold text-sm">+ {dynamicOpt.price.toFixed(2)} €</span>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="p-6 bg-black/50 border-t border-white/10 shrink-0">
                                <button
                                    onClick={(e) => {
                                        addToCart(selectedItem, 1, selectedOptionsModal, e);
                                        setIsModalOpen(false);
                                    }}
                                    className="w-full py-4 bg-mitake-gold text-mitake-black font-semibold rounded-xl hover:bg-white transition-colors duration-300 flex justify-between items-center px-6"
                                >
                                    <span>Ajouter au panier</span>
                                    <span>
                                        {(selectedItem.price + selectedOptionsModal.reduce((acc, opt) => acc + opt.price, 0)).toFixed(2)} €
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section >
    );
};

export default MenuSection;
