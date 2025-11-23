import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartItems, setIsCartOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Le Ramen', href: '#ramen' },
        { name: 'Le Sushi', href: '#sushi' },
        { name: 'Le Chef', href: '#chef' },
        { name: 'La Carte', href: '#menu' },
        { name: 'Infos', href: '#infos' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="text-2xl font-serif font-bold tracking-tighter">
                    Mitake <span className="text-mitake-terracotta">Ramen</span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium hover:text-mitake-terracotta transition-colors uppercase tracking-widest"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    {/* Cart Icon with Badge */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative hidden md:flex items-center space-x-2 bg-mitake-dark text-white px-4 py-2 rounded-full hover:bg-mitake-terracotta transition-colors duration-300"
                    >
                        <ShoppingBag size={18} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-mitake-gold text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        )}
                    </button>

                    {/* Mobile Cart Icon */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative md:hidden text-mitake-dark"
                    >
                        <ShoppingBag size={24} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-mitake-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        )}
                    </button>

                    <button
                        className="md:hidden text-mitake-dark"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-mitake-dark hover:text-mitake-terracotta"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <button className="w-full flex items-center justify-center space-x-2 bg-mitake-terracotta text-white px-6 py-3 rounded-full">
                                <ShoppingBag size={18} />
                                <span>Commander (Click & Collect)</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
