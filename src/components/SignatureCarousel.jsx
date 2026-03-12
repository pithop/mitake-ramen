import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import chirashiImage from '../assets/signature-chirashi.png';
import gyozaImage from '../assets/signature-gyoza.png';

const SignatureCarousel = () => {
    const items = [
        {
            title: "Curry Ebi Fried",
            price: "17,10 €",
            desc: "Crevettes panées, curry japonais authentique.",
            image: "https://www.sushi-aixsud.com/550-large_default/curry-ebi-fried.jpg"
        },
        {
            title: "10 Sushi Mix",
            price: "19,40 €",
            desc: "Sélection du chef, pêche du jour.",
            image: "https://www.sushi-aixsud.com/530-large_default/8-sushi-mix.jpg"
        },
        {
            title: "Tonkotsu Ramen",
            price: "16,50 €",
            desc: "Bouillon porc mijoté 24h, œuf ajitsuke.",
            image: "https://www.sushi-aixsud.com/853-large_default/ramen-tonkotsu-classic.jpg"
        },
        {
            title: "Chirashi Deluxe",
            price: "26,30 €",
            desc: "L'excellence du poisson cru sur riz vinaigré.",
            image: "https://www.sushi-aixsud.com/93-large_default/chirashi-deluxe.jpg"
        },
        {
            title: "Gyoza Maison",
            price: "8,50 €",
            desc: "Raviolis grillés, farce porc et légumes.",
            image: "https://www.sushi-aixsud.com/111-large_default/gyoza-par-6-poulet-crevettes-legumes.jpg"
        }
    ];

    return (
        <section className="bg-mitake-black pb-10 pt-10 md:pt-20 relative z-10 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 mb-10 flex items-end justify-between">
                <div>
                    <span className="text-mitake-gold text-sm tracking-[0.3em] uppercase font-bold">Signature</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-mitake-offwhite mt-2 italic">Nos Incontournables</h2>
                </div>
                <div className="hidden md:flex gap-2 text-mitake-gold/50 text-sm items-center">
                    <span>Glisser pour découvrir</span>
                    <ArrowRight size={16} />
                </div>
            </div>

            {/* Carousel Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pl-6 md:pl-10 pr-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="relative flex-shrink-0 w-[300px] h-[400px] rounded-sm overflow-hidden group snap-center cursor-pointer border border-white/5 hover:border-mitake-gold/30 transition-colors"
                    >
                        {/* Image avec Ken Burns effect (100% -> 105% sur 500ms) */}
                        <img
                            src={item.image}
                            alt={`${item.title} - ${item.desc}`}
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                        {/* Content */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex justify-between items-end border-b border-white/20 pb-3 mb-3">
                                <h3 className="text-xl font-serif text-white italic group-hover:text-mitake-gold transition-colors">{item.title}</h3>
                                <span className="text-mitake-gold font-bold text-lg">{item.price}</span>
                            </div>
                            <p className="text-gray-300 font-light text-sm line-clamp-2">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}

                {/* Spacer for right padding visual balance */}
                <div className="w-1 flex-shrink-0"></div>
            </div>
        </section>
    );
};

export default SignatureCarousel;
