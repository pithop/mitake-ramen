import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Footer from '../components/Footer';

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-mitake-black min-h-screen text-white flex flex-col">
            <SeoHead 
                title="Contact, Adresse & Horaires | MitaKe Ramen Aix-en-Provence"
                description="Venez manger chez MitaKe Ramen à Aix-en-Provence. Retrouvez notre adresse, les horaires d'ouverture et nos cordonnées exactes pour réserver ou commander."
                canonicalUrl="https://mitakeramen.page/contact"
            />
            
            <header className="pt-8 pb-4 px-6 max-w-7xl mx-auto w-full flex justify-between items-center border-b border-white/10 shrink-0">
                <a href="/" className="text-mitake-gold font-serif text-xl tracking-widest font-bold hover:text-white transition-colors">
                    MITAKE
                </a>
                <a href="/" className="text-sm uppercase tracking-widest hover:text-mitake-gold transition-colors">
                    ← Accueil
                </a>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                {/* Informations Locales MitaKe */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-mitake-gold text-sm tracking-[0.3em] uppercase font-bold mb-4 block">Nous trouver</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-mitake-offwhite italic mb-10">Adresse & Contact</h1>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <MapPin className="text-mitake-gold shrink-0 mt-1" size={24} />
                            <div>
                                <h2 className="text-xl font-bold mb-1 text-mitake-offwhite">MitaKe Restaurant</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    569 Av. Henri Mauriat<br/>
                                    13100 Aix-en-Provence<br/>
                                    France
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <Clock className="text-mitake-gold shrink-0 mt-1" size={24} />
                            <div className="w-full">
                                <h2 className="text-xl font-bold mb-3 text-mitake-offwhite">Horaires d'Ouverture</h2>
                                <ul className="text-gray-400 space-y-2 w-full text-sm">
                                    <li className="flex justify-between gap-4"><span>Mercredi</span> <span className="text-white text-right">11h30 - 14h00</span></li>
                                    <li className="flex justify-between gap-4"><span>Mar, Jeu, Ven</span> <span className="text-white text-right">11h30-14h00<br/>18h00-21h00</span></li>
                                    <li className="flex justify-between gap-4"><span>Samedi</span> <span className="text-white text-right">18h00 - 21h00</span></li>
                                    <li className="pt-3 border-t border-white/10 text-gray-500 italic mt-3">Fermé Lundi & Dimanche</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <Phone className="text-mitake-gold shrink-0 mt-1" size={24} />
                            <div>
                                <h2 className="text-xl font-bold mb-1 text-mitake-offwhite">Nous Appeler</h2>
                                <a href="tel:+33972213899" className="text-gray-400 hover:text-mitake-gold transition-colors block">
                                    09 72 21 38 99
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Google Maps Embed */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-full min-h-[400px] w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative"
                >
                    <iframe 
                        src="https://maps.google.com/maps?q=569%20Av.%20Henri%20Mauriat,%2013100%20Aix-en-Provence&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                        width="100%" 
                        height="100%" 
                        style={{border: 0, position: 'absolute', top: 0, left: 0}} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps MitaKe Ramen"
                    ></iframe>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
