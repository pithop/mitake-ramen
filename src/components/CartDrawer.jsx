import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Utensils, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        getCartTotal,
        submitOrderToPOS,
        orderMode,
        setIsOrderModeModalOpen,
        setIsOrderInterceptModalOpen,
        waitTime,
        addToCart,
        isDeliveryAvailable
    } = useCart();

    const total = getCartTotal();

    const handleValidateOrder = () => {
        // If order mode is not selected, open the modal first
        if (!orderMode) {
            setIsCartOpen(false); // Close cart drawer
            if (isDeliveryAvailable) {
                setIsOrderModeModalOpen(true);
            } else {
                setIsOrderInterceptModalOpen(true); // Open Intercept Modal
            }
        } else {
            // Mode is already selected, submit the order
            submitOrderToPOS();
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-mitake-black border-l border-white/10 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2 sm:gap-3">
                                <ShoppingBag className="text-mitake-gold w-5 h-5 sm:w-6 sm:h-6" />
                                Votre Panier
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                    <ShoppingBag size={64} className="opacity-20" />
                                    <p className="text-base sm:text-lg">Votre panier est vide</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-mitake-gold hover:underline text-sm sm:text-base"
                                    >
                                        Retourner au menu
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.cartId}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="flex gap-3 sm:gap-4 bg-white/5 p-3 sm:p-4 rounded-lg border border-white/5"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-base sm:text-lg">{item.name}</h3>
                                            <p className="text-mitake-gold text-sm sm:text-base">
                                                {((item.price + (item.selectedOptions ? item.selectedOptions.reduce((acc, opt) => acc + opt.price, 0) : 0)) * item.quantity).toFixed(2)} €
                                            </p>
                                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                                                    {item.selectedOptions.map((opt, i) => (
                                                        <div key={i} className="flex justify-between">
                                                            <span>+ {opt.name}</span>
                                                            <span>{opt.price > 0 ? `+${opt.price.toFixed(2)}€` : ''}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {item.kitchen_note && (
                                                <p className="text-xs text-gray-400 mt-1 italic truncate">Note: {item.kitchen_note}</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end justify-between gap-2">
                                            <button
                                                onClick={() => removeFromCart(item.cartId)}
                                                className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                                            >
                                                <X size={16} />
                                            </button>

                                            <div className="flex items-center gap-2 sm:gap-3 bg-black/40 rounded-full p-1 border border-white/10">
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, -1)}
                                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-mono font-bold w-4 text-center text-sm sm:text-base">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, 1)}
                                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer & Cross-Selling */}
                        {cartItems.length > 0 && (
                            <div className="bg-black/40 border-t border-white/10 flex flex-col">
                                {/* Cross-Selling Section */}
                                <div className="p-4 sm:p-5 border-b border-white/5">
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Complétez votre commande</h4>
                                    <div className="flex overflow-x-auto snap-x gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {/* Mock Cross-sell items */}
                                        {[
                                            { id: 'mochi', name: 'Mochi Glacé', price: 4.50 },
                                            { id: 'gyoza-side', name: 'Gyoza Poulet', price: 6.70 },
                                            { id: 'edamame', name: 'Edamame', price: 4.00 }
                                        ].map(item => (
                                            <div key={item.id} className="snap-start shrink-0 w-32 bg-white/5 rounded-lg p-3 border border-white/5 hover:border-mitake-gold/30 transition-colors flex flex-col justify-between group">
                                                <div>
                                                    <h5 className="text-xs font-bold text-white group-hover:text-mitake-gold transition-colors">{item.name}</h5>
                                                    <span className="text-mitake-gold text-xs">{item.price.toFixed(2)} €</span>
                                                </div>
                                                <button
                                                    className="mt-2 w-full flex items-center justify-center gap-1 bg-white/10 hover:bg-mitake-gold hover:text-black transition-colors rounded py-1 text-[10px] font-bold uppercase"
                                                    onClick={() => {
                                                        addToCart(item);
                                                    }}
                                                >
                                                    <Plus size={12} /> Ajouter
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals & CTA */}
                                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
                                            <span className="text-gray-400">Total</span>
                                            <span className="text-white">{total.toFixed(2)} €</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-400">
                                            <span>Temps d'attente estimé</span>
                                            <span className="text-mitake-gold font-bold flex items-center gap-1">
                                                <Clock size={14} />
                                                {waitTime} min
                                            </span>
                                        </div>
                                    </div>

                                    {orderMode && (
                                        <div className="text-xs sm:text-sm text-gray-500 flex justify-between">
                                            <span>Mode:</span>
                                            <span className="text-mitake-gold uppercase font-bold">
                                                {orderMode === 'dine_in' ? 'Sur Place' :
                                                    orderMode === 'takeaway' ? 'À Emporter' :
                                                        orderMode === 'delivery' ? 'Livraison' : 'Non défini'}
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleValidateOrder}
                                        className="w-full bg-mitake-gold text-black font-bold py-3 sm:py-4 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation relative overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></span>
                                        <Utensils size={18} className="sm:w-5 sm:h-5 relative z-10" />
                                        <span className="relative z-10">{orderMode ? 'Envoyer la commande' : 'Valider la commande'}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
