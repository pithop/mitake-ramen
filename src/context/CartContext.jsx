import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { generateOrderTicket } from '../utils/pdfTicket';
import { calculateWaitTime, isStoreOpen } from '../utils/storeSettings';

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
    const [isOrderInterceptModalOpen, setIsOrderInterceptModalOpen] = useState(false);

    // Animation States
    const [flyingDots, setFlyingDots] = useState([]);
    const [cartBump, setCartBump] = useState(0);

    // Store Logic State
    const [waitTime, setWaitTime] = useState(15);
    const [activeOrdersCount, setActiveOrdersCount] = useState(0);
    const [isStoreOpenState, setIsStoreOpenState] = useState(true); // Default true to avoid flash, updated on mount

    // Mock Data - Restaurant State
    // In a real app, this would come from an API
    const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true); // Repurposed for Online Ordering Master Switch
    const [unavailableItems, setUnavailableItems] = useState([]); // Array of item IDs (using titles as IDs for now if no explicit ID)
    const [customPrices, setCustomPrices] = useState({}); // Dynamic supplement prices
    const [posBasePrices, setPosBasePrices] = useState({}); // Base prices from pos_products sync
    const [isDeliveryModeEnabled, setIsDeliveryModeEnabled] = useState(true); // Separate delivery mode toggle

    // Load admin state from Supabase on mount & Subscribe to changes
    useEffect(() => {
        fetchSettings();
        fetchActiveOrdersCount();
        checkStoreStatus();

        // Realtime Subscription for Settings
        const settingsSubscription = supabase
            .channel('public:pos_stock_status')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pos_stock_status' }, (payload) => {
                console.log('🔄 Realtime Product Update:', payload);
                // We re-fetch all settings to ensure we get the full list of unavailable items correctly.
                // Could also optimize by just updating the local array based on the single payload.
                fetchSettings();
            })
            .subscribe();

        // Realtime Subscription for Orders (to update wait time)
        const ordersSubscription = supabase
            .channel('public:pos_orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pos_orders' }, () => {
                fetchActiveOrdersCount();
            })
            .subscribe();

        // Check store status every minute
        const statusInterval = setInterval(checkStoreStatus, 60000);

        return () => {
            supabase.removeChannel(settingsSubscription);
            supabase.removeChannel(ordersSubscription);
            clearInterval(statusInterval);
        };
    }, []);

    // Recalculate wait time whenever cart or active orders change
    useEffect(() => {
        const time = calculateWaitTime(cartItems, activeOrdersCount);
        setWaitTime(time);
    }, [cartItems, activeOrdersCount]);

    const checkStoreStatus = () => {
        setIsStoreOpenState(isStoreOpen());
    };

    const fetchActiveOrdersCount = async () => {
        // Count orders that are NOT ready/completed/cancelled
        const { count, error } = await supabase
            .from('pos_orders')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'ready')
            .neq('status', 'completed')
            .neq('status', 'cancelled');

        if (!error) {
            setActiveOrdersCount(count || 0);
        }
    };

    const fetchSettings = async () => {
        // Fetch out-of-stock items dynamically from pos_stock_status
        try {
            const { data: outOfStockProducts, error: productsError } = await supabase
                .from('pos_stock_status')
                .select('product_name')
                .eq('available', false);

            if (productsError) {
                console.error('Error fetching out of stock products:', productsError);
            } else if (outOfStockProducts) {
                const outOfStockNames = outOfStockProducts.map(p => p.product_name);
                setUnavailableItems(outOfStockNames);
            }

            // Fetch base prices from pos_products to keep website prices 100% in sync
            try {
                const { data: posProductsData, error: posProductsError } = await supabase
                    .from('pos_products')
                    .select('name, price');
                
                if (!posProductsError && posProductsData) {
                    const priceMap = {};
                    posProductsData.forEach(p => {
                        priceMap[p.name] = parseFloat(p.price);
                    });
                    setPosBasePrices(priceMap);
                }
            } catch (err) {
                console.error('Failed to sync base prices:', err);
            }

            // Fetch global settings (Online Ordering Switch & Custom Prices)
            const { data: settingsData } = await supabase
                .from('settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (settingsData) {
                setIsDeliveryAvailable(settingsData.is_delivery_available);
                
                // Parse custom prices and delivery mode from unavailable_items
                if (settingsData.unavailable_items) {
                    const parsedPrices = {};
                    settingsData.unavailable_items.forEach(item => {
                        if (item.startsWith('PRICE||')) {
                            const [, name, priceStr] = item.split('||');
                            parsedPrices[name] = parseFloat(priceStr);
                        }
                        if (item === 'SETTING||delivery_mode||false') {
                            setIsDeliveryModeEnabled(false);
                        }
                        if (item === 'SETTING||delivery_mode||true') {
                            setIsDeliveryModeEnabled(true);
                        }
                    });
                    setCustomPrices(parsedPrices);
                }
            }

        } catch (err) {
            console.error('Unexpected error in fetchSettings:', err);
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

    const triggerFlyingDot = (startX, startY) => {
        const id = Date.now() + Math.random();
        setFlyingDots(prev => [...prev, { id, startX, startY }]);
        // Remove the dot and trigger bump after animation (800ms)
        setTimeout(() => {
            setFlyingDots(prev => prev.filter(dot => dot.id !== id));
            setCartBump(prev => prev + 1);
        }, 800);
    };

    const addToCart = (item, quantity = 1, options = [], event = null) => {
        // Check stock
        const itemNameToCheck = item.posName || item.name;
        if (unavailableItems.includes(itemNameToCheck)) {
            alert("Désolé, cet article est en rupture de stock.");
            return;
        }

        setCartItems(prevItems => {
            // Sort options for consistent matching
            const sortedOptions = [...options].sort((a, b) => a.name.localeCompare(b.name));

            const existingItemIndex = prevItems.findIndex(i => {
                if (i.name !== item.name) return false;
                const iSorted = [...(i.selectedOptions || [])].sort((a, b) => a.name.localeCompare(b.name));
                return JSON.stringify(iSorted) === JSON.stringify(sortedOptions);
            });

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                return [...prevItems, {
                    ...item,
                    quantity,
                    selectedOptions: sortedOptions,
                    cartId: `${item.name}-${Date.now()}` // Unique ID for React keys if needed
                }];
            }
        });

        if (event && event.clientX && event.clientY) {
            triggerFlyingDot(event.clientX, event.clientY);
        } else {
            setIsCartOpen(true);
        }
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
        
        // Generate daily sequential web ID
        const todayStr = new Date().toISOString().split('T')[0];
        const { count } = await supabase
            .from('pos_orders')
            .select('*', { count: 'exact', head: true })
            .eq('source_device', 'website')
            .gte('created_at', todayStr);
            
        const orderNum = (count !== null ? count + 1 : 1);
        const orderId = `WEB-${String(orderNum).padStart(3, '0')}`;

        // 1. PREPARE pos_orders PAYLOAD
        const posOrderData = {
            id: orderId,
            total: total,
            status: 'pending', // CRITIQUE : "pending" signifie que la caisse doit l'encaisser/valider
            order_type: orderMode, // 'dine_in' | 'takeaway' | 'delivery'
            source_device: 'website',
            customer_name: orderDetails.phone ? `${orderDetails.customerName || "Client Web"} - ${orderDetails.phone}` : (orderDetails.customerName || "Client Web"),
            pickup_time: orderDetails.pickupTime || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            items_json: cartItems.map(item => {
                const optionsPrice = item.selectedOptions ? item.selectedOptions.reduce((acc, opt) => acc + opt.price, 0) : 0;
                return {
                    name: item.posName || item.name,
                    quantity: item.quantity,
                    price: item.price + optionsPrice,
                    options: item.selectedOptions || [],
                    comment: item.kitchen_note || ""
                };
            }),
            payment_method: 'unpaid',
            payment_details: [{
                delivery_address: orderMode === 'delivery' ? orderDetails.address : null,
                customer_notes: orderDetails.notes || ""
            }]
        };

        // 2. PREPARE pos_order_items PAYLOAD
        const posOrderItemsData = cartItems.map(item => {
            const optionsPrice = item.selectedOptions ? item.selectedOptions.reduce((acc, opt) => acc + opt.price, 0) : 0;
            return {
                id: crypto.randomUUID(),
                order_id: orderId,
                product_id: item.id || item.posName || item.name.toLowerCase().replace(/\s+/g, '-'),
                product_name: item.name,
                quantity: item.quantity,
                unit_price: item.price + optionsPrice,
                total_price: (item.price + optionsPrice) * item.quantity,
                selected_modifiers: JSON.stringify(item.selectedOptions || [])
            };
        });

        console.log("📤 Tentative d'envoi de la commande au POS...");
        console.log("🔵 Payload pos_orders:", posOrderData);
        console.log("🔵 Payload pos_order_items:", posOrderItemsData);

        try {
            // STEP 1: Insert into pos_orders
            const { error: orderError } = await supabase.from('pos_orders').insert([posOrderData]);

            if (orderError) {
                console.error("❌ Erreur Supabase (pos_orders):", orderError);
                alert(`Erreur création commande: ${orderError.message}`);
                return;
            }

            // STEP 2: Insert into pos_order_items
            if (posOrderItemsData.length > 0) {
                const { error: itemsError } = await supabase.from('pos_order_items').insert(posOrderItemsData);

                if (itemsError) {
                    console.error("❌ Erreur Supabase (pos_order_items):", itemsError);
                    alert(`Erreur création lignes de commande: ${itemsError.message}`);
                    return;
                }
            }

            console.log("✅ COMMANDES ENREGISTRÉES AVEC SUCCÈS DANS LE POS !");

            // Generate and download PDF ticket
            console.log("📄 Génération du ticket PDF...");
            // Remapping posOrderData back to the old format temporarily to not break pdfTicket.js logic
            const legacyOrderData = {
                order_number: posOrderData.id.split('-')[0].toUpperCase(), // Just a short string for the ticket
                status: 'pending_print',
                type: posOrderData.order_type,
                customer_info: {
                    name: posOrderData.customer_name,
                    phone: orderDetails.phone || "",
                    address: orderMode === 'delivery' ? orderDetails.address : null,
                    notes: orderDetails.notes || ""
                }
            };
            generateOrderTicket(legacyOrderData, orderDetails, cartItems, total);

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
        isOrderInterceptModalOpen,
        setIsOrderInterceptModalOpen,
        isDeliveryAvailable,
        setIsDeliveryAvailable, // Exposed for Admin
        customPrices, // Exposed for dynamic override
        posBasePrices, // Expose for dynamic base price sync
        unavailableItems,
        setUnavailableItems, // Exposed for Admin
        updateSettings, // Exposed for Admin
        isDeliveryModeEnabled, // Exposed for delivery toggle
        setIsDeliveryModeEnabled, // Exposed for Admin
        submitOrderToPOS,
        // New Logic
        waitTime,
        isStoreOpen: isStoreOpenState,
        // Animations
        flyingDots,
        cartBump,
        triggerFlyingDot
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
