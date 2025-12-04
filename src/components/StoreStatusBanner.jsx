import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getNextOpeningTime } from '../utils/storeSettings';

const StoreStatusBanner = () => {
    const { isStoreOpen } = useCart();
    const [nextOpening, setNextOpening] = useState('');

    useEffect(() => {
        if (!isStoreOpen) {
            setNextOpening(getNextOpeningTime());
        }
    }, [isStoreOpen]);

    if (isStoreOpen) return null;

    return (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-3 text-sm md:text-base font-bold shadow-lg z-50 relative">
            <AlertCircle size={20} className="animate-pulse" />
            <span>Fermé actuellement. {nextOpening}</span>
        </div>
    );
};

export default StoreStatusBanner;
