import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check } from 'lucide-react';

const ProductCustomizationModal = ({ isOpen, onClose, product, onConfirm }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [quantity, setQuantity] = useState(1);

    // Reset state when product changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedOptions([]);
            setQuantity(1);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const toggleOption = (option) => {
        if (selectedOptions.some(opt => opt.name === option.name)) {
            setSelectedOptions(selectedOptions.filter(opt => opt.name !== option.name));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const calculateTotal = () => {
        const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
        return (product.price + optionsTotal) * quantity;
    };

    const handleConfirm = () => {
        onConfirm(product, quantity, selectedOptions);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-mitake-black border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-white">{product.name}</h2>
                                    <p className="text-mitake-gold font-medium mt-1">{product.price.toFixed(2)} €</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {product.description && (
                                    <p className="text-gray-400 text-sm mb-6 italic">
                                        {product.description}
                                    </p>
                                )}

                                {product.availableOptions && product.availableOptions.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                                            Personnalisez votre plat
                                        </h3>
                                        <div className="space-y-2">
                                            {product.availableOptions.map((option) => {
                                                const isSelected = selectedOptions.some(opt => opt.name === option.name);
                                                return (
                                                    <div
                                                        key={option.name}
                                                        onClick={() => toggleOption(option)}
                                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected
                                                                ? 'bg-mitake-gold/10 border-mitake-gold text-white'
                                                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-mitake-gold border-mitake-gold' : 'border-gray-500'
                                                                }`}>
                                                                {isSelected && <Check size={14} className="text-black" />}
                                                            </div>
                                                            <span>{option.name}</span>
                                                        </div>
                                                        <span className="font-medium">
                                                            {option.price > 0 ? `+${option.price.toFixed(2)} €` : 'Gratuit'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                                {/* Quantity */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300 font-medium">Quantité</span>
                                    <div className="flex items-center gap-4 bg-black/40 rounded-full p-1 border border-white/10">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold text-white w-4 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Add Button */}
                                <button
                                    onClick={handleConfirm}
                                    className="w-full bg-mitake-gold text-black font-bold py-4 rounded-lg hover:bg-white transition-colors flex justify-between items-center px-6"
                                >
                                    <span>Ajouter au panier</span>
                                    <span>{calculateTotal().toFixed(2)} €</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductCustomizationModal;
