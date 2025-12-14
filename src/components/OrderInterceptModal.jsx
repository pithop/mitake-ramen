import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabaseClient';

const OrderInterceptModal = ({ isOpen, onClose, onBypass }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleWaitlistSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (error) throw error;

            setIsSuccess(true);
            setEmail('');
        } catch (error) {
            console.error('Error adding to waitlist:', error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-mitake-black border border-white/10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-6 sm:p-8 space-y-6">
                                {/* Header */}
                                <div className="text-center space-y-2">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mitake-gold/20 text-mitake-gold mb-2">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-white">
                                        La commande en ligne arrive bientôt !
                                    </h2>
                                    <p className="text-gray-300">
                                        Notre plateforme digitale est en cours de déploiement. Pour l'instant, passez votre commande directement avec nous :
                                    </p>
                                </div>

                                {/* Main CTA */}
                                <a
                                    href="tel:0972213899"
                                    className="block w-full bg-mitake-gold text-black font-bold text-lg py-4 rounded-lg hover:bg-white transition-colors text-center flex items-center justify-center gap-3"
                                >
                                    <Phone size={24} />
                                    Appeler le 09 72 21 38 99
                                </a>

                                {/* Divider */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-mitake-black px-4 text-sm text-gray-500">Restez informé</span>
                                    </div>
                                </div>

                                {/* Waitlist Form */}
                                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <Mail size={18} className="text-mitake-gold" />
                                        Voulez-vous être averti du lancement ?
                                    </h3>

                                    {isSuccess ? (
                                        <div className="text-green-400 text-sm bg-green-400/10 p-3 rounded border border-green-400/20">
                                            Merci ! Vous serez informé dès que la commande en ligne sera disponible.
                                        </div>
                                    ) : (
                                        <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                                            <input
                                                type="email"
                                                placeholder="votre@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-mitake-gold text-sm"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50"
                                            >
                                                {isSubmitting ? '...' : "M'inscrire"}
                                            </button>
                                        </form>
                                    )}
                                </div>

                                {/* Test Mode Bypass */}
                                <div className="text-center pt-2">
                                    <button
                                        onClick={onBypass}
                                        className="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center justify-center gap-1 mx-auto"
                                    >
                                        Continuer (Mode Test) <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OrderInterceptModal;
