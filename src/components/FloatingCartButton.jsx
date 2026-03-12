import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FloatingCartButton = () => {
    const { cartItems, setIsCartOpen, isCartOpen, cartBump } = useCart();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const [bumpScale, setBumpScale] = useState(1);

    useEffect(() => {
        if (cartBump > 0) {
            setBumpScale(1.2);
            const timer = setTimeout(() => setBumpScale(1), 300);
            return () => clearTimeout(timer);
        }
    }, [cartBump]);

    // Hide the button when cart drawer is open
    if (isCartOpen) return null;

    return (
        <AnimatePresence>
            {totalItems > 0 && (
                <motion.button
                    id="floating-cart-btn"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: bumpScale, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-mitake-gold text-black rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl hover:shadow-mitake-gold/50 transition-all duration-300 touch-manipulation"
                    aria-label="Ouvrir le panier"
                >
                    <ShoppingBag size={24} strokeWidth={2} className="sm:w-7 sm:h-7" />

                    {/* Badge with item count */}
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border-2 border-white animate-pulse"
                    >
                        {totalItems}
                    </motion.span>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default FloatingCartButton;
