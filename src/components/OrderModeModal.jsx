import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShoppingBag, Utensils, X, Clock, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderModeModal = ({ isOpen, onClose }) => {
    const { setOrderMode, setOrderDetails, isDeliveryAvailable, setIsCartOpen } = useCart();
    const [selectedMode, setSelectedMode] = useState(null); // 'dine_in', 'takeaway', 'delivery'

    // Form states
    const [tableNumber, setTableNumber] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [address, setAddress] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedMode) return;

        if (selectedMode === 'delivery' && !isDeliveryAvailable) {
            alert("La livraison n'est pas disponible ce soir.");
            return;
        }

        // Save details and mode
        setOrderDetails({
            tableNumber,
            pickupTime,
            address,
            customerName,
            phone,
            notes: customerNotes
        });
        setOrderMode(selectedMode);
        onClose();

        // Reopen cart drawer so user can see "Envoyer la commande" button
        setTimeout(() => {
            setIsCartOpen(true);
        }, 300); // Small delay for smooth transition
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-mitake-black border border-white/10 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative flex flex-col"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-6 md:p-8 overflow-y-auto flex-1">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 text-center">Comment souhaitez-vous commander ?</h2>
                        <p className="text-gray-400 text-center mb-6 md:mb-8">Choisissez votre mode de dégustation</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            {/* Dine In */}
                            <button
                                onClick={() => setSelectedMode('dine_in')}
                                className={`p-4 md:p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 md:gap-4 group ${selectedMode === 'dine_in'
                                    ? 'bg-mitake-gold/10 border-mitake-gold text-mitake-gold'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                                    }`}
                            >
                                <Utensils size={40} className={`md:w-12 md:h-12 ${selectedMode === 'dine_in' ? 'text-mitake-gold' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="text-lg md:text-xl font-bold">Sur Place</span>
                            </button>

                            {/* Takeaway */}
                            <button
                                onClick={() => setSelectedMode('takeaway')}
                                className={`p-4 md:p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 md:gap-4 group ${selectedMode === 'takeaway'
                                    ? 'bg-mitake-gold/10 border-mitake-gold text-mitake-gold'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                                    }`}
                            >
                                <ShoppingBag size={40} className={`md:w-12 md:h-12 ${selectedMode === 'takeaway' ? 'text-mitake-gold' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="text-lg md:text-xl font-bold">À Emporter</span>
                            </button>

                            {/* Delivery */}
                            <button
                                onClick={() => isDeliveryAvailable && setSelectedMode('delivery')}
                                disabled={!isDeliveryAvailable}
                                className={`p-4 md:p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 md:gap-4 group relative ${!isDeliveryAvailable
                                    ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/5'
                                    : selectedMode === 'delivery'
                                        ? 'bg-mitake-gold/10 border-mitake-gold text-mitake-gold'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                                    }`}
                            >
                                <MapPin size={40} className={`md:w-12 md:h-12 ${selectedMode === 'delivery' ? 'text-mitake-gold' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="text-lg md:text-xl font-bold">Livraison</span>
                                {!isDeliveryAvailable && (
                                    <span className="absolute bottom-2 text-xs text-red-400 font-medium">Pas de livreur ce soir</span>
                                )}
                            </button>
                        </div>

                        {/* Dynamic Form Fields */}
                        <AnimatePresence mode="wait">
                            {selectedMode && (
                                <motion.form
                                    key={selectedMode}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4 md:space-y-6 bg-white/5 p-4 md:p-6 rounded-xl border border-white/10 max-h-[60vh] overflow-y-auto"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                                <User size={16} /> Nom
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-mitake-gold outline-none transition-colors"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                                <Phone size={16} /> Téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-mitake-gold outline-none transition-colors"
                                                placeholder="06..."
                                            />
                                        </div>
                                    </div>

                                    {selectedMode === 'dine_in' && (
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Numéro de table (Optionnel)</label>
                                            <input
                                                type="text"
                                                value={tableNumber}
                                                onChange={(e) => setTableNumber(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-mitake-gold outline-none transition-colors"
                                                placeholder="Ex: 12"
                                            />
                                        </div>
                                    )}

                                    {selectedMode === 'takeaway' && (
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                                <Clock size={16} /> Heure de retrait souhaitée
                                            </label>
                                            <input
                                                type="time"
                                                required
                                                value={pickupTime}
                                                onChange={(e) => setPickupTime(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-mitake-gold outline-none transition-colors"
                                            />
                                        </div>
                                    )}

                                    {selectedMode === 'delivery' && (
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                                <MapPin size={16} /> Adresse de livraison
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    required
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    className={`w-full bg-black/50 border rounded-lg p-3 text-white outline-none transition-colors min-h-[100px] pr-10 ${address.length > 10
                                                        ? 'border-green-500/50 focus:border-green-500'
                                                        : 'border-white/10 focus:border-mitake-gold'
                                                        }`}
                                                    placeholder="Adresse complète, digicode, étage..."
                                                />
                                                {address.length > 10 && (
                                                    <div className="absolute top-3 right-3 text-green-500">
                                                        <CheckCircle size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            {address.length > 0 && address.length <= 10 && (
                                                <p className="text-xs text-red-400">L'adresse semble un peu courte...</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Customer Notes (for all modes) */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 flex items-center gap-2">
                                            <MessageSquare size={16} /> Préférences / Notes (Optionnel)
                                        </label>
                                        <textarea
                                            value={customerNotes}
                                            onChange={(e) => setCustomerNotes(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-mitake-gold outline-none transition-colors min-h-[80px]"
                                            placeholder="Ex: Végétarien, sans porc, allergies, préférences de cuisson..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={selectedMode === 'delivery' && address.length <= 10}
                                        className={`w-full font-bold py-3 md:py-4 rounded-lg transition-colors mt-4 ${selectedMode === 'delivery' && address.length <= 10
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-mitake-gold text-black hover:bg-white'
                                            }`}
                                    >
                                        Confirmer le mode
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderModeModal;
