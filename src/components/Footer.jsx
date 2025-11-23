import React from 'react';
import { Instagram, Facebook, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer id="footer" className="bg-mitake-dark text-white py-10 md:py-20 border-t border-white/5 relative z-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-16">

                    {/* Brand */}
                    <div className="space-y-4 md:space-y-6">
                        <h3 className="text-2xl font-serif font-bold">
                            Mitake <span className="text-mitake-gold">Ramen</span>
                        </h3>
                        <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs">
                            L'authenticité du Ramen japonais à Aix-en-Provence. Bouillons mijotés, nouilles artisanales et saveurs profondes.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-mitake-gold hover:text-black transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-mitake-gold hover:text-black transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-lg font-serif font-bold text-mitake-gold">Nous Trouver</h4>
                        <div className="space-y-2 md:space-y-4 text-sm text-gray-400 font-light">
                            <p>569 Avenue Henri Mauriat<br />13100 Aix-en-Provence</p>
                            <p>04 42 50 60 70<br />contact@mitake-ramen.com</p>
                        </div>
                    </div>

                    {/* Horaires */}
                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-lg font-serif font-bold text-mitake-gold">Horaires</h4>
                        <div className="space-y-2 text-sm text-gray-400 font-light">
                            <div className="flex justify-between max-w-[200px]">
                                <span>Mardi - Samedi</span>
                                <span>11h30 - 14h00</span>
                            </div>
                            <div className="flex justify-between max-w-[200px]">
                                <span>Mardi - Dimanche</span>
                                <span>18h30 - 21h00</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 italic">Fermé le Lundi soir & Samedi midi</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-xs text-gray-600">© 2024 Mitake Ramen. Tous droits réservés.</p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        <a href="#" className="hover:text-mitake-gold transition-colors">Mentions Légales</a>
                        <a href="#" className="hover:text-mitake-gold transition-colors">Politique de Confidentialité</a>
                    </div>

                    {/* Scroll to Top Button */}
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ y: -5 }}
                        className="flex items-center gap-2 text-xs text-mitake-gold uppercase tracking-widest hover:text-white transition-colors mt-4 md:mt-0"
                    >
                        Haut de page
                        <div className="w-8 h-8 rounded-full border border-mitake-gold flex items-center justify-center">
                            <ArrowUp size={14} />
                        </div>
                    </motion.button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
