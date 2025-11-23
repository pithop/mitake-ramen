import React, { useState } from 'react';
import { MENU_DATA } from '../data/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import yakitoriImage from '../assets/section-yakitori.png';
import sushiImage from '../assets/section-sushi.png';
import { useCart } from '../context/CartContext';

const MenuSection = () => {
    const [activeTab, setActiveTab] = useState('atelier');
    const [expandedCategory, setExpandedCategory] = useState(null);
    const { addToCart, unavailableItems } = useCart();

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
            {/* Tab Navigation */}
            <div className="sticky top-0 z-30 bg-mitake-black/90 backdrop-blur-md border-b border-white/5 py-4 md:py-6 mb-8 md:mb-12">
                <div className="container mx-auto px-4 md:px-6 flex justify-center gap-8 md:gap-12">
                    <button
                        onClick={() => setActiveTab('atelier')}
                        className={`text-base md:text-xl font-serif tracking-widest transition-all duration-500 relative ${activeTab === 'atelier' ? 'text-mitake-gold' : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        L'ATELIER
                        {activeTab === 'atelier' && (
                            <motion.div layoutId="underline" className="absolute -bottom-2 left-0 right-0 h-[1px] bg-mitake-gold" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('comptoir')}
                        className={`text-base md:text-xl font-serif tracking-widest transition-all duration-500 relative ${activeTab === 'comptoir' ? 'text-mitake-gold' : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        LE COMPTOIR
                        {activeTab === 'comptoir' && (
                            <motion.div layoutId="underline" className="absolute -bottom-2 left-0 right-0 h-[1px] bg-mitake-gold" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {activeTab === 'atelier' ? (
                        <motion.div
                            key="atelier"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col lg:flex-row"
                        >
                            {/* Sticky Image Left */}
                            <div className="w-full lg:w-1/2 h-[30vh] md:h-[40vh] lg:h-auto lg:min-h-[60vh] lg:sticky lg:top-32 overflow-hidden self-start z-0">
                                <div
                                    className="w-full h-full min-h-[30vh] bg-cover bg-center transform hover:scale-105 transition-transform duration-[20s]"
                                    style={{ backgroundImage: `url(${yakitoriImage})` }}
                                >
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
                                                        <div className="space-y-4 py-4 md:py-6">
                                                            {category.items.map((item, i) => {
                                                                const isUnavailable = unavailableItems.includes(item.name);

                                                                return (
                                                                    <div
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
                                                                                            addToCart(item);
                                                                                        }}
                                                                                        className="relative z-20 cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-mitake-gold/10 border-2 border-mitake-gold/30 flex items-center justify-center text-mitake-gold hover:bg-mitake-gold hover:text-black transition-all duration-300 transform hover:scale-110 active:scale-95 touch-manipulation"
                                                                                        aria-label="Ajouter au panier"
                                                                                    >
                                                                                        <Plus size={20} />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="comptoir"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col-reverse lg:flex-row"
                        >
                            {/* Menu List Left (Accordions) */}
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
                                                        <div className="space-y-4 py-4 md:py-6">
                                                            {category.items.map((item, i) => {
                                                                const isUnavailable = unavailableItems.includes(item.name);

                                                                return (
                                                                    <div
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
                                                                                            addToCart(item);
                                                                                        }}
                                                                                        className="relative z-20 cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full bg-mitake-gold/10 border-2 border-mitake-gold/30 flex items-center justify-center text-mitake-gold hover:bg-mitake-gold hover:text-black transition-all duration-300 transform hover:scale-110 active:scale-95 touch-manipulation"
                                                                                        aria-label="Ajouter au panier"
                                                                                    >
                                                                                        <Plus size={20} />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sticky Image Right */}
                            <div className="w-full lg:w-1/2 h-[30vh] md:h-[40vh] lg:h-auto lg:min-h-[60vh] lg:sticky lg:top-32 overflow-hidden self-start z-0">
                                <div
                                    className="w-full h-full min-h-[30vh] bg-cover bg-center transform hover:scale-105 transition-transform duration-[20s]"
                                    style={{ backgroundImage: `url(${sushiImage})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-mitake-black pointer-events-none"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default MenuSection;
