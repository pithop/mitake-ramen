import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import chirashiImage from '../assets/signature-chirashi.png';
import gyozaImage from '../assets/signature-gyoza.png';

const SignatureCarousel = () => {
    const items = [
        {
            title: "Tonkotsu Classic",
            price: "14,00 €",
            desc: "Notre bouillon emblématique mijoté 12 heures, authentique de Kyushu.",
            image: "https://www.sushi-aixsud.com/853-large_default/ramen-tonkotsu-classic.jpg"
        },
        {
            title: "Tonkotsu Cha-Shu",
            price: "15,50 €",
            desc: "La version gourmande avec 5 tranches de poitrine de porc fondante et œuf mollet.",
            image: "https://www.sushi-aixsud.com/852-large_default/ramen-tonkotsu-cha-shu.jpg"
        },
        {
            title: "Mazé Men",
            price: "15,00 €",
            desc: "Le style sans bouillon originel de Nagoya. Puissant, texturé et irrésistible.",
            image: "https://www.sushi-aixsud.com/854-large_default/maze-men-ramen-sans-bouillon.jpg"
        }
    ];

    return (
        <section className="bg-mitake-black pb-10 pt-10 md:pt-20 relative z-10 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 mb-10 flex items-end justify-center md:justify-between">
                <div className="text-center md:text-left">
                    <span className="text-mitake-gold text-sm tracking-[0.3em] uppercase font-bold">L'Essence MitaKe</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-mitake-offwhite mt-2 italic">Nos Ramens Signatures</h2>
                    <div className="h-1 w-20 bg-mitake-gold mt-4 mx-auto md:mx-0"></div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:grid md:grid-cols-3 gap-8 pb-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="relative w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden group cursor-pointer shadow-2xl shadow-black/50"
                        >
                        {/* Image avec Ken Burns effect (100% -> 105% sur 500ms) */}
                        <img
                            src={item.image}
                            alt={`${item.title} - ${item.desc}`}
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Gradient Overlay */}
                        {/* Gradient Overlay pour le texte */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Cadre décoratif */}
                        <div className="absolute inset-4 border border-mitake-gold/20 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>

                        {/* Content */}
                        <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex justify-between items-end border-b border-mitake-gold/30 pb-3 mb-3">
                                <h3 className="text-2xl font-serif text-mitake-offwhite italic">{item.title}</h3>
                                <span className="text-mitake-gold font-bold text-xl">{item.price}</span>
                            </div>
                            <p className="text-gray-300 font-light text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-500">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SignatureCarousel;
