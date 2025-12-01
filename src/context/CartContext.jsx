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

    // Load admin state from Supabase on mount & Subscribe to changes
    useEffect(() => {
        fetchSettings();

        // Realtime Subscription
        const settingsSubscription = supabase
            .channel('public:settings')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload) => {
                console.log('🔄 Realtime Update:', payload);
                const { is_delivery_available, unavailable_items } = payload.new;
                setIsDeliveryAvailable(is_delivery_available);
                setUnavailableItems(unavailable_items || []);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(settingsSubscription);
        };
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (error) {
            console.error('Error fetching settings:', error);
            // Fallback to defaults if table is empty or error
        } else if (data) {
            setIsDeliveryAvailable(data.is_delivery_available);
            setUnavailableItems(data.unavailable_items || []);
        }
    };

    const updateSettings = async (newDeliveryStatus, newUnavailableItems) => {
        // Optimistic Update
        setIsDeliveryAvailable(newDeliveryStatus);
        setUnavailableItems(newUnavailableItems);

        const { error } = await supabase
            .from('settings')
            .update({
                is_delivery_available: newDeliveryStatus,
                unavailable_items: newUnavailableItems
            })
            .eq('id', 1); // Assuming single row with ID 1

        if (error) {
            console.error('Error updating settings:', error);
            alert("Erreur lors de la sauvegarde des paramètres.");
            // Revert? For now, we trust the optimistic update or next fetch
        }
    };

    const addToCart = (item, quantity = 1, options = []) => {
        // Check stock
        if (unavailableItems.includes(item.name)) {
            alert("Désolé, cet article est en rupture de stock.");
            return;
        }

        setCartItems(prevItems => {
            // Create a unique ID for the cart item based on product and options
            // We'll use a composite key or just check deep equality of options
            const existingItemIndex = prevItems.findIndex(i =>
                i.name === item.name &&
                JSON.stringify(i.selectedOptions) === JSON.stringify(options)
            );

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                return [...prevItems, {
                    ...item,
                    quantity,
                    selectedOptions: options,
                    cartId: `${item.name}-${Date.now()}` // Unique ID for React keys if needed
                }];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (itemCartId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== itemCartId));
    };

    const updateQuantity = (itemCartId, delta) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.cartId === itemCartId) {
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
            const optionsPrice = item.selectedOptions ? item.selectedOptions.reduce((acc, opt) => acc + opt.price, 0) : 0;
            return total + ((item.price + optionsPrice) * item.quantity);
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
                const optionsPrice = item.selectedOptions ? item.selectedOptions.reduce((acc, opt) => acc + opt.price, 0) : 0;
                return {
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price + optionsPrice, // Unit price including options
                    options: item.selectedOptions || [],
                    comment: item.kitchen_note || ""
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
        updateSettings, // Exposed for Admin
        submitOrderToPOS
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
