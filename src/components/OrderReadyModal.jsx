import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, CheckCircle2, Navigation, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderReadyModal = () => {
    const { readyOrderEvent, dismissReadyNotification } = useCart();

    if (!readyOrderEvent) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            >
                <div 
                    className="absolute inset-0 z-0 bg-gradient-to-tr from-mitake-gold/20 via-transparent to-red-500/20 opacity-50"
                    onClick={dismissReadyNotification}
                />
                
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="relative z-10 w-full max-w-md bg-mitake-black ring-1 ring-white/20 shadow-[0_0_50px_rgba(212,175,55,0.3)] rounded-3xl p-8 flex flex-col items-center text-center overflow-hidden"
                >
                    {/* Animated Glow in background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-mitake-gold/20 blur-3xl rounded-full" />
                    
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-24 h-24 bg-gradient-to-br from-mitake-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg mb-6 relative"
                    >
                        <CheckCircle2 size={48} className="text-black" />
                        
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-2 -right-2 text-white drop-shadow-md"
                        >
                            <PartyPopper size={32} />
                        </motion.div>
                    </motion.div>

                    <h2 className="text-3xl font-serif font-black text-white mb-2 uppercase tracking-wider">
                        C'est Prêt !
                    </h2>

                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        Excellente nouvelle ! Votre <span className="font-bold text-mitake-gold">commande n°{readyOrderEvent.id}</span> 
                        {' '}vous attend bien chaude au comptoir de MitaKe Ramen.
                    </p>

                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex items-center gap-4 text-left">
                        <div className="bg-white/10 p-3 rounded-full shrink-0">
                            <UtensilsCrossed size={24} className="text-mitake-gold" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Passez en boutique</p>
                            <p className="font-bold text-white text-lg">Retrait immédiat</p>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={dismissReadyNotification}
                            className="w-full py-4 rounded-xl bg-mitake-gold hover:bg-yellow-500 text-black font-black text-xl tracking-wide uppercase transition-colors shadow-lg"
                        >
                            J'arrive !
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderReadyModal;
