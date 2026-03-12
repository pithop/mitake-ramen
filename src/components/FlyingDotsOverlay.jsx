import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const FlyingDotsOverlay = () => {
    const { flyingDots } = useCart();
    const [targetPos, setTargetPos] = useState({ x: window.innerWidth - 40, y: 40 }); // Fallback top right

    useEffect(() => {
        // Find visible cart icon
        const getCartTarget = () => {
            const targets = ['navbar-cart-btn', 'navbar-cart-mobile', 'floating-cart-btn'];
            for (const id of targets) {
                const el = document.getElementById(id);
                if (el && window.getComputedStyle(el).display !== 'none') {
                    const rect = el.getBoundingClientRect();
                    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                }
            }
            return { x: window.innerWidth - 40, y: 40 };
        };

        const updatePosition = () => {
            setTargetPos(getCartTarget());
        };

        // Update target position frequently to catch scrolling/navbar changes
        const interval = setInterval(updatePosition, 500);
        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            <AnimatePresence>
                {flyingDots.map(dot => (
                    <motion.div
                        key={dot.id}
                        initial={{
                            x: dot.startX,
                            y: dot.startY,
                            scale: 0.5,
                            opacity: 1
                        }}
                        animate={{
                            x: targetPos.x,
                            y: targetPos.y,
                            scale: [0.5, 1.5, 0.5],
                            opacity: [1, 1, 0]
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeInOut"
                        }}
                        className="absolute w-6 h-6 bg-mitake-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,1)] -ml-3 -mt-3"
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FlyingDotsOverlay;
