import React from 'react';
import { motion } from 'framer-motion';

const PhilosophySection = () => {
    return (
        <section className="py-20 bg-mitake-black relative z-10 flex items-center justify-center">
            <div className="container mx-auto px-6 text-center max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2 }}
                >
                    <p className="text-2xl md:text-4xl font-serif text-mitake-offwhite leading-relaxed italic">
                        "Chaque bol est une histoire qui mijote depuis <span className="text-mitake-gold not-italic">24 heures</span>."
                    </p>
                    <div className="w-12 h-[1px] bg-mitake-gold/50 mx-auto mt-12"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default PhilosophySection;
