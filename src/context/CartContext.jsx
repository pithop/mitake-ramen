import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { generateOrderTicket } from '../utils/pdfTicket';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [orderMode, setOrderMode] = useState(null); // 'dine_in' | 'takeaway' | 'delivery' | null
    const [orderDetails, setOrderDetails] = useState({}); // { tableNumber, pickupTime, address, customerName, phone }
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrderModeModalOpen, setIsOrderModeModalOpen] = useState(false);

    // Mock Data - Restaurant State
    // In a real app, this would come from an API
    const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);
    const [unavailableItems, setUnavailableItems] = useState([]); // Array of item IDs (using titles as IDs for now if no explicit ID)

    // Load admin state from localStorage on mount
    useEffect(() => {
        const savedAdminState = localStorage.getItem('mitake_admin_state');
        if (savedAdminState) {
            const { delivery, stock } = JSON.parse(savedAdminState);
            if (delivery !== undefined) setIsDeliveryAvailable(delivery);
            if (stock) setUnavailableItems(stock);
        }
    }, []);

    const addToCart = (item, quantity = 1, options = {}) => {
        // Check stock
        if (unavailableItems.includes(item.titre)) {
            alert("Désolé, cet article est en rupture de stock.");
            return;
        }

        setCartItems(prevItems => {
            // Create a unique ID for the cart item based on product and options
            // For now, we'll just use the title as we don't have complex options yet
            const existingItemIndex = prevItems.findIndex(i => i.titre === item.titre);

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                return [...prevItems, { ...item, quantity, ...options }];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (itemTitle) => {
        setCartItems(prevItems => prevItems.filter(item => item.titre !== itemTitle));
    };

    const updateQuantity = (itemTitle, delta) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.titre === itemTitle) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            // Parse price string "12,50 €" -> 12.50
            const priceString = item.prix.replace(' €', '').replace(',', '.');
            const price = parseFloat(priceString);
            return total + (price * item.quantity);
        }, 0);
    };

    const submitOrderToPOS = async () => {
        const total = getCartTotal();

        // STRICT JSON MAPPING FOR PYTHON SCRIPT
        const orderData = {
            order_number: `CMD-${Date.now()}`, // ID unique
            status: 'pending_print',           // OBLIGATOIRE pour déclencher l'imprimante
            type: orderMode,                   // 'dine_in' | 'takeaway' | 'delivery'
            total_price: total,
            customer_info: {
                name: orderDetails.customerName || "Client Web",
                phone: orderDetails.phone || "0600000000",
                address: orderMode === 'delivery' ? orderDetails.address : null,
                notes: orderDetails.notes || ""  // NOUVEAU: Notes client
            },

            // LE PLUS IMPORTANT : MAPPING DES ITEMS
            items: cartItems.map(item => {
                const priceString = item.prix.replace(' €', '').replace(',', '.');
                const price = parseFloat(priceString);

                return {
                    name: item.titre,      // Le script Python cherche la clé 'name', pas 'title' !
                    quantity: item.quantity,    // Le script cherche 'quantity', pas 'amount' !
                    price: price,
                    options: [], // No options implemented yet
                    comment: item.kitchen_note || "" // Toujours une string vide si null
                };
            })
        };

        console.log("📤 Tentative d'envoi de la commande...");
        console.log("🔧 Supabase URL:", import.meta.env.VITE_APP_SUPABASE_URL);
        console.log("🔵 Payload à envoyer:", orderData);

        try {
            const { data, error } = await supabase.from('orders').insert([orderData]);

            if (error) {
                console.error("❌ Erreur Supabase:", error);
                console.error("❌ Message:", error.message);
                console.error("❌ Details:", error.details);
                console.error("❌ Hint:", error.hint);
                console.error("❌ Code:", error.code);
                alert(`Erreur Supabase: ${error.message}`);
                return;
            }

            console.log("✅ ORDER SENT TO SUPABASE:", orderData);
            console.log("✅ Response data:", data);

            // Generate and download PDF ticket
            console.log("📄 Génération du ticket PDF...");
            generateOrderTicket(orderData, orderDetails, cartItems, total);

            alert("Commande envoyée en cuisine ! Votre ticket a été téléchargé.");
            clearCart();
            setOrderMode(null);
            setIsCartOpen(false);
        } catch (err) {
            console.error("❌ Erreur inattendue:", err);
            alert("Une erreur inattendue est survenue.");
        }
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        orderMode,
        setOrderMode,
        orderDetails,
        setOrderDetails,
        isCartOpen,
        setIsCartOpen,
        isOrderModeModalOpen,
        setIsOrderModeModalOpen,
        isDeliveryAvailable,
        setIsDeliveryAvailable, // Exposed for Admin
        unavailableItems,
        setUnavailableItems, // Exposed for Admin
        submitOrderToPOS
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
