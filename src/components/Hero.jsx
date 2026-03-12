import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import heroImage from '../assets/hero-ramen.png';

const Hero = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const title = "MITAKE RAMEN";

    // Hooks pour l'effet Parallaxe
    const { scrollY } = useScroll();
    // Le fond descendra légèrement pendant qu'on scroll vers le bas
    const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);

    const scrollToSection = (id) => {
        setIsMenuOpen(false);
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-mitake-black">
            {/* Conteneur Parallaxe & Background avec Slow Zoom */}
            <motion.div
                style={{ y: yParallax }}
                className="absolute inset-0 w-full h-[120%] -top-[10%]"
            >
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
            </motion.div>

            {/* Gradient Mask plus prononcé pour la transition vers le contenu noir */}
            <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-mitake-black via-mitake-black/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-black/30 z-0"></div> {/* Assombrissement global */}

            {/* Navigation Minimaliste */}
            <nav className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-mitake-gold font-serif text-xl tracking-widest font-bold"
                >
                    MITAKE
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white hover:text-mitake-gold transition-colors flex items-center gap-2 group"
                >
                    <span className="text-sm uppercase tracking-[0.2em] hidden md:block group-hover:tracking-[0.3em] transition-all duration-500">
                        {isMenuOpen ? 'Fermer' : 'Menu'}
                    </span>
                    {isMenuOpen ? <X className="w-6 h-6 stroke-1" /> : <Menu className="w-6 h-6 stroke-1" />}
                </motion.button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-mitake-black/95 backdrop-blur-2xl z-40 flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-8">
                            {['L\'Atelier', 'Le Comptoir', 'Contact'].map((item, index) => (
                                <motion.button
                                    key={item}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    onClick={() => scrollToSection(item === 'Contact' ? 'footer' : 'menu')}
                                    className="text-3xl md:text-5xl font-serif text-mitake-offwhite hover:text-mitake-gold transition-colors italic"
                                >
                                    {item}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contenu Principal - Typographie Cinématique */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
                <div className="overflow-hidden mb-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-mitake-offwhite tracking-tight leading-none flex flex-wrap justify-center drop-shadow-2xl">
                        {title.split("").map((char, index) => (
                            <motion.span
                                key={index}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.2 + index * 0.08,
                                    ease: [0.16, 1, 0.3, 1] // Courbe d'animation plus premium
                                }}
                                className={char === " " ? "w-3 md:w-6" : ""}
                            >
                                {char}
                            </motion.span>
                        ))}
                        <span className="sr-only">Aix-en-Provence</span>
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                >
                    <p className="text-mitake-gold/90 text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] uppercase font-light">
                        L'Artisanat du Bouillon à Aix-en-Provence
                    </p>
                </motion.div>
            </div>

            {/* Indicateur de Scroll Animé (Nouveau) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 cursor-pointer"
                onClick={() => scrollToSection('menu')}
            >
                <span className="text-mitake-gold/60 text-[10px] tracking-[0.3em] uppercase writing-vertical-lr font-light">
                    Découvrir
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="text-mitake-gold/60 w-5 h-5 stroke-1" />
                </motion.div>
            </motion.div>

            {/* Inscriptions Japonaises (Watermark Subtle) */}
            <div className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 writing-vertical-rl text-6xl md:text-9xl font-serif text-white opacity-[0.02] pointer-events-none select-none hidden lg:block">
                ラーメン
            </div>
            <div className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 writing-vertical-rl text-6xl md:text-9xl font-serif text-white opacity-[0.02] pointer-events-none select-none hidden lg:block">
                三竹
            </div>
        </section>
    );
};

export default Hero;
