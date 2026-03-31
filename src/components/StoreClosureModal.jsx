import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const StoreClosureModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const MODAL_VERSION = 'closure_2026_03_30_v1'; // Change this key for future temporary modals

    useEffect(() => {
        // Check if the user has already seen this specific modal version
        const hasSeenModal = localStorage.getItem(MODAL_VERSION);
        if (!hasSeenModal) {
            // Small delay for better UX (doesn't pop up instantly on extreme load)
            const timer = setTimeout(() => setIsOpen(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem(MODAL_VERSION, 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-mitake-black border border-mitake-gold/30 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header Banner */}
                        <div className="bg-mitake-gold/10 p-6 flex flex-col items-center justify-center border-b border-mitake-gold/20 relative">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-mitake-gold/60 hover:text-mitake-gold transition-colors p-2"
                                aria-label="Fermer"
                            >
                                <X size={24} />
                            </button>
                            <AlertCircle size={40} className="text-mitake-gold mb-3" />
                            <h2 className="text-2xl font-serif text-mitake-gold text-center">
                                Fermeture Exceptionnelle
                            </h2>
                        </div>

                        {/* Body */}
                        <div className="p-8 flex flex-col items-center text-center space-y-6">
                            <p className="text-mitake-offwhite text-lg leading-relaxed">
                                Chère clientèle, notre établissement sera exceptionnellement fermé le <strong className="text-white">mardi 31 mars</strong>.
                            </p>

                            <div className="bg-black/50 p-4 rounded-xl border border-white/10 w-full">
                                <p className="text-gray-300">
                                    Nous rouvrirons nos portes le <strong className="text-mitake-gold">mercredi 1er avril au matin</strong>.
                                </p>
                                <p className="text-gray-400 text-sm mt-2 italic">
                                    (Rappel : Nous fermons habituellement nos portes tous les mercredis soirs.)
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/10 w-full">
                                <p className="text-2xl font-serif text-mitake-gold mb-2">
                                    またのお越しをお待ちしております
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Nous avons hâte de vous retrouver très bientôt !
                                </p>
                            </div>

                            <button
                                onClick={handleClose}
                                className="mt-4 w-full py-4 bg-mitake-gold text-black font-semibold rounded-xl hover:bg-white transition-colors duration-300 flex justify-center items-center"
                            >
                                J'ai compris
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StoreClosureModal;
