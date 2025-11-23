import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FloatingCartButton = () => {
    const { cartItems, setIsCartOpen, isCartOpen } = useCart();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Hide the button when cart drawer is open
    if (isCartOpen) return null;

    return (
        <AnimatePresence>
            {totalItems > 0 && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-mitake-gold text-black rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-mitake-gold/50 transition-all duration-300"
                    aria-label="Ouvrir le panier"
                >
                    <ShoppingBag size={28} strokeWidth={2} />

                    {/* Badge with item count */}
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white animate-pulse"
                    >
                        {totalItems}
                    </motion.span>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default FloatingCartButton;
