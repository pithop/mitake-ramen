import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import heroImage from '../assets/hero-ramen.png';

const Hero = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const title = "MITAKE RAMEN";

    const scrollToSection = (id) => {
        setIsMenuOpen(false);
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Cinematic Background with Slow Zoom */}
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
            />

            {/* Gradient Mask to fade into black */}
            <div className="absolute inset-0 bg-gradient-to-t from-mitake-black via-mitake-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-black/20"></div> {/* Overall dim */}

            {/* Minimal Navigation */}
            <nav className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-mitake-gold font-serif text-xl tracking-widest font-bold z-50"
                >
                    MITAKE
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white hover:text-mitake-gold transition-colors flex items-center gap-2 group z-50"
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
                        className="fixed inset-0 bg-mitake-black/95 backdrop-blur-xl z-40 flex items-center justify-center"
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

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
                <div className="overflow-hidden mb-4">
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-mitake-offwhite tracking-tight leading-none flex flex-wrap justify-center">
                        {title.split("").map((char, index) => (
                            <motion.span
                                key={index}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    duration: 1,
                                    delay: 0.5 + index * 0.1,
                                    ease: [0.33, 1, 0.68, 1]
                                }}
                                className={char === " " ? "w-2 md:w-4 md:w-8" : ""}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2 }}
                >
                    <p className="text-mitake-gold/80 text-xs md:text-lg tracking-[0.2em] md:tracking-[0.3em] uppercase font-light">
                        L'Artisanat du Bouillon à Aix-en-Provence
                    </p>
                </motion.div>
            </div>

            {/* Japanese Watermark */}
            <div className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 writing-vertical-rl text-6xl md:text-9xl font-serif text-white opacity-[0.03] pointer-events-none select-none hidden md:block">
                ラーメン
            </div>
            <div className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 writing-vertical-rl text-6xl md:text-9xl font-serif text-white opacity-[0.03] pointer-events-none select-none hidden md:block">
                三竹
            </div>
        </section>
    );
};

export default Hero;
