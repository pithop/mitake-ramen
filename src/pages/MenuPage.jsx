import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MenuSection from '../components/MenuSection';
import SeoHead from '../components/SeoHead';
import Footer from '../components/Footer';

const MenuPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-mitake-black min-h-screen text-white">
            <SeoHead 
                title="La Carte & Menu | MitaKe Ramen Aix-en-Provence"
                description="Découvrez l'intégralité de la carte du restaurant MitaKe Ramen à Aix-en-Provence. Ramen Tonkotsu, Mazé Men, Gyozas maison et spécialités japonaises."
                canonicalUrl="https://mitakeramen.page/menu"
            />
            
            {/* Header simple avec bouton de retour */}
            <header className="pt-8 pb-4 px-6 max-w-7xl mx-auto flex justify-between items-center border-b border-white/10">
                <a href="/" className="text-mitake-gold font-serif text-xl tracking-widest font-bold hover:text-white transition-colors">
                    MITAKE
                </a>
                <a href="/" className="text-sm uppercase tracking-widest hover:text-mitake-gold transition-colors">
                    ← Accueil
                </a>
            </header>

            <main className="pb-20 pt-10">
                <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif text-mitake-offwhite italic mb-4"
                    >
                        Notre Carte Japonaise
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 font-light max-w-2xl mx-auto"
                    >
                        Toutes nos spécialités sont préparées sur place avec passion. Notre bouillon Tonkotsu pour nos ramens mijote longuement pour vous offrir des saveurs authentiques, dignes du Japon, au cœur d'Aix-en-Provence.
                    </motion.p>
                </div>

                {/* On réutilise le composant MenuSection existant */}
                <MenuSection />
            </main>

            <Footer />
        </div>
    );
};

export default MenuPage;
