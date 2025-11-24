import React from 'react';
import { motion } from 'framer-motion';
import { Fish, Snowflake, Star, ArrowRight } from 'lucide-react';

const ChefSection = () => {
    const features = [
        {
            icon: <Fish className="w-6 h-6 text-kyo-indigo" />,
            title: "Poissons d'Exception",
            desc: "Sélectionnés chaque matin pour une fraîcheur absolue."
        },
        {
            icon: <Snowflake className="w-6 h-6 text-kyo-indigo" />,
            title: "Maîtrise du Froid",
            desc: "Une conservation et une découpe respectant la tradition Edomae."
        },
        {
            icon: <Star className="w-6 h-6 text-kyo-indigo" />,
            title: "Partenariat Exclusif",
            desc: "Le meilleur de Kyo Sushi, directement chez Mitake."
        }
    ];

    return (
        <section id="chef" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 space-y-8 z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-kyo-indigo text-sm font-bold tracking-[0.2em] uppercase">L'Alliance Parfaite</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-mitake-dark mt-4 mb-6">L'Expérience Complète :<br />Nos Sushis Kyo</h2>
                            <p className="text-lg text-gray-600 leading-relaxed font-light">
                                Pour parfaire votre repas, Mitake Ramen s'associe à <span className="font-medium text-kyo-indigo">Kyo Sushi</span>.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed font-light mt-4">
                                Envie de fraîcheur après la chaleur du bouillon ? Découvrez notre sélection exclusive de sushis, sashimis et rolls, préparés avec la même rigueur que nos ramen.
                            </p>
                            <div className="mt-6 p-4 bg-kyo-indigo/5 border-l-4 border-kyo-indigo rounded">
                                <p className="text-sm text-gray-700 italic">
                                    Supervisé par le <span className="font-semibold text-kyo-indigo">Chef Kikuchi San</span>, 22 ans d'expérience.
                                </p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    className="flex flex-col items-center text-center lg:items-start lg:text-left"
                                >
                                    <div className="bg-kyo-indigo/10 p-4 rounded-full mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-serif text-lg font-medium mb-2 text-kyo-indigo">{feature.title}</h3>
                                    <p className="text-sm text-gray-500">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="pt-8"
                        >
                            <a
                                href="#menu"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // This is a bit hacky, but effective for this demo to switch tabs if we had access to the state context
                                    // For now, we just scroll to menu. In a real app, we'd use a context or prop to switch the tab.
                                    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center gap-2 bg-kyo-indigo text-white px-8 py-3 rounded-full hover:bg-kyo-blue transition-colors shadow-lg shadow-kyo-indigo/20"
                            >
                                <span>COMMANDER NOS SUSHIS EN PLUS</span>
                                <ArrowRight size={18} />
                            </a>
                        </motion.div>
                    </div>

                    {/* Image Content */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop"
                                    alt="Plateau de Sushis Kyo Sushi frais et variés"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-kyo-indigo/10 rounded-full blur-3xl -z-10"></div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ChefSection;
