/**
 * Safely parses a JSON string.
 * @param {string|object} data - The data to parse. If it's already an object, it's returned as is.
 * @param {any} fallbackValue - The value to return if parsing fails or data is null/undefined.
 * @returns {any} - The parsed object or the fallback value.
 */
export const safeJSONParse = (data, fallbackValue = []) => {
    if (!data) return fallbackValue;
    if (typeof data === 'object') return data; // Already parsed
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("JSON Parse Error:", error, "Data:", data);
        return fallbackValue;
    }
};
