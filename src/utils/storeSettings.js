import { format, addMinutes, isBefore, isAfter, parse, set, getDay, getHours, getMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

// 1. CONFIGURATION HORAIRES STRICTE
export const OPENING_HOURS = {
    1: [{ start: '11:30', end: '14:00' }], // Lundi
    2: [{ start: '11:30', end: '14:00' }, { start: '18:00', end: '21:00' }], // Mardi
    3: [{ start: '11:30', end: '14:00' }], // Mercredi
    4: [{ start: '11:30', end: '14:00' }, { start: '18:00', end: '21:00' }], // Jeudi
    5: [{ start: '11:30', end: '14:00' }, { start: '18:00', end: '21:00' }], // Vendredi
    6: [{ start: '18:00', end: '21:00' }], // Samedi
    0: [] // Dimanche (Fermé)
};

// Poids en minutes pour l'algo "Single Chef"
const PREP_TIMES = {
    ramen: 4,
    hot_dish: 3, // Curry, Donburi
    side: 2, // Gyoza, Tapas
    easy: 0 // Sushi, Boissons
};

/**
 * Vérifie si le restaurant est actuellement ouvert.
 * @returns {boolean}
 */
export const isStoreOpen = () => {
    const now = new Date();
    const day = getDay(now);
    const slots = OPENING_HOURS[day];

    if (!slots || slots.length === 0) return false;

    const currentTime = format(now, 'HH:mm');

    return slots.some(slot => {
        return currentTime >= slot.start && currentTime < slot.end;
    });
};

/**
 * Récupère le prochain créneau d'ouverture.
 * @returns {string} Message "Ouvre Lundi à 11h30" ou "Ouvre dans X heures"
 */
export const getNextOpeningTime = () => {
    const now = new Date();
    let currentDay = getDay(now);
    let checkDate = new Date(now);

    // Check next 7 days
    for (let i = 0; i < 7; i++) {
        const slots = OPENING_HOURS[currentDay];

        if (slots && slots.length > 0) {
            for (const slot of slots) {
                const [startHour, startMin] = slot.start.split(':').map(Number);
                const slotDate = set(checkDate, { hours: startHour, minutes: startMin, seconds: 0 });

                if (isAfter(slotDate, now)) {
                    // Found next slot
                    const diffMs = slotDate - now;
                    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                    if (i === 0 && diffHrs < 24) {
                        return `Ouvre dans ${diffHrs}h ${diffMins}min`;
                    } else {
                        const dayName = format(slotDate, 'EEEE', { locale: fr });
                        return `Ouvre ${dayName} à ${slot.start}`;
                    }
                }
            }
        }

        // Move to next day
        checkDate.setDate(checkDate.getDate() + 1);
        checkDate.setHours(0, 0, 0, 0);
        currentDay = (currentDay + 1) % 7;
    }

    return "Fermé pour le moment";
};

/**
 * Génère les 7 prochains jours ouverts.
 * @returns {Array} [{ label: "Aujourd'hui", value: Date }, { label: "Demain", value: Date }, ...]
 */
export const getAvailableDates = () => {
    const dates = [];
    const now = new Date();
    let checkDate = new Date(now);

    for (let i = 0; i < 7; i++) {
        const day = getDay(checkDate);
        const slots = OPENING_HOURS[day];

        // If open today (or future day), add to list
        if (slots && slots.length > 0) {
            let label = format(checkDate, 'EEEE d MMMM', { locale: fr });
            if (i === 0) label = "Aujourd'hui";
            if (i === 1) label = "Demain";

            // Capitalize first letter
            label = label.charAt(0).toUpperCase() + label.slice(1);

            dates.push({
                label: label,
                value: new Date(checkDate), // Clone date
                dateStr: format(checkDate, 'yyyy-MM-dd') // For value matching
            });
        }

        // Next day
        checkDate.setDate(checkDate.getDate() + 1);
    }
    return dates;
};

/**
 * Génère les créneaux de 15 min disponibles pour une date donnée.
 * @param {Date} dateObj Date sélectionnée (par défaut aujourd'hui)
 * @returns {Array} Liste des heures ['11:30', '11:45', ...]
 */
export const generateTimeSlots = (dateObj = new Date()) => {
    const now = new Date();
    const isToday = format(dateObj, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

    const day = getDay(dateObj);
    const slots = OPENING_HOURS[day];
    const timeSlots = [];

    if (!slots) return [];

    slots.forEach(slot => {
        const [startHour, startMin] = slot.start.split(':').map(Number);
        const [endHour, endMin] = slot.end.split(':').map(Number);

        let current = set(dateObj, { hours: startHour, minutes: startMin, seconds: 0 });
        const end = set(dateObj, { hours: endHour, minutes: endMin, seconds: 0 });

        while (isBefore(current, end)) {
            // If today, filter past times + buffer
            if (isToday) {
                if (isAfter(current, addMinutes(now, 15))) {
                    timeSlots.push(format(current, 'HH:mm'));
                }
            } else {
                // Future dates: all slots available
                timeSlots.push(format(current, 'HH:mm'));
            }
            current = addMinutes(current, 15);
        }
    });

    return timeSlots;
};

/**
 * Calcule le temps d'attente estimé.
 * @param {Array} cartItems 
 * @param {number} activeOrdersCount 
 * @returns {number} Minutes d'attente
 */
export const calculateWaitTime = (cartItems, activeOrdersCount = 0) => {
    const BASE_WAIT = 15;
    const ORDERS_PENALTY = 3; // 3 min per active order

    let cartWeight = 0;
    cartItems.forEach(item => {
        // Simple keyword matching for category detection
        const name = item.name.toLowerCase();
        if (name.includes('ramen') || name.includes('soba') || name.includes('udon')) {
            cartWeight += PREP_TIMES.ramen;
        } else if (name.includes('donburi') || name.includes('curry') || name.includes('riz')) {
            cartWeight += PREP_TIMES.hot_dish;
        } else if (name.includes('gyoza') || name.includes('edamame') || name.includes('karaage')) {
            cartWeight += PREP_TIMES.side;
        } else {
            cartWeight += PREP_TIMES.easy;
        }
    });

    // Total = Base + Cart Weight + (Active Orders * Penalty)
    return BASE_WAIT + cartWeight + (activeOrdersCount * ORDERS_PENALTY);
};

/**
 * Vérifie si un créneau est saturé (Throttling).
 * @param {string} slotTime "HH:mm"
 * @param {Array} orders Commandes du jour
 * @returns {boolean} True si saturé
 */
export const isSlotFull = (slotTime, orders) => {
    // Max 5 Ramens (or equivalent load) per 15 min slot
    const MAX_LOAD_PER_SLOT = 20; // minutes of work

    // Filter orders for this slot (approximate matching)
    // In a real app, we'd check pickup_time column. 
    // Here we assume we pass orders that are scheduled for this slot.

    // For MVP, we might just count total orders pending if we don't have strict slot booking in DB yet.
    // But let's assume we filter by pickup_time if available, or created_at if immediate.

    // Placeholder logic:
    // const slotOrders = orders.filter(o => o.pickup_time === slotTime);
    // const currentLoad = slotOrders.reduce((acc, o) => acc + calculateOrderWeight(o), 0);
    // return currentLoad >= MAX_LOAD_PER_SLOT;

    return false; // Default to open for now until we have orders with pickup_time
};
