import React from 'react';
import { MapPin, Truck, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';

const LogisticsSection = () => {
    return (
        <section id="infos" className="py-24 bg-mitake-dark text-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-mitake-terracotta text-sm font-bold tracking-[0.2em] uppercase">Livraison & Zones</span>
                    <h2 className="text-4xl md:text-5xl font-serif mt-4">À Votre Porte</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Zones Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <div className="flex items-start gap-4 mb-6">
                                <MapPin className="w-6 h-6 text-mitake-terracotta flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-serif mb-2">Zone 1 : Aix-Centre & Le Tholonet</h3>
                                    <p className="text-gray-400 text-sm">Livraison offerte dès 30€ de commande.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-mitake-terracotta flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-serif mb-2">Zone 2 : Puyricard & Meyreuil</h3>
                                    <p className="text-gray-400 text-sm">Livraison offerte dès 45€ de commande.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-6 bg-mitake-terracotta/10 rounded-xl border border-mitake-terracotta/20">
                            <Thermometer className="w-8 h-8 text-mitake-terracotta" />
                            <div>
                                <h4 className="font-bold text-mitake-terracotta mb-1">Respect de la Chaîne Thermique</h4>
                                <p className="text-sm text-gray-300">Livraison en compartiments séparés pour garantir le chaud et le froid.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map Placeholder or Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative h-96 rounded-2xl overflow-hidden bg-gray-800"
                    >
                        {/* In a real app, embed a Google Map or a stylized map image here */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <Truck className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                <p className="text-white/40 font-serif italic">Zone de livraison L'Atelier</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LogisticsSection;
