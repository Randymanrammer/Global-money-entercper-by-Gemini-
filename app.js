/**
 * Global Money Interceptor – UPGRADED app.js
 * Status: Live API Bridge Active | Zero-Trust Fallback Enabled
 */

// 1. SET THE SOVEREIGN FALLBACK (Your "Safety Net")
const FALLBACK_RATES = {
    USD: { rate: 1, name: "US Dollar" },
    EUR: { rate: 0.85, name: "Euro" },
    JPY: { rate: 152.40, name: "Japanese Yen" },
    GBP: { rate: 0.72, name: "British Pound" },
    CAD: { rate: 1.38, name: "Canadian Dollar" }
};

// This variable will hold the live data once the API hits
let LIVE_RATES = { ...FALLBACK_RATES };

// 2. THE LIVE SYNC ENGINE
async function syncInterceptorRates() {
    // Replace with your actual key from exchangerate-api.com
    const API_KEY = 'YOUR_API_KEY';
    const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('QUANTUM_LINK_FAILURE');

        const data = await response.json();

        // Injecting live market data into the fleet
        Object.keys(data.conversion_rates).forEach(currency => {
            LIVE_RATES[currency] = {
                rate: data.conversion_rates[currency],
                name: currency
            };
        });

        console.log("🛰️ INTERCEPTOR SYNC: SUCCESS. LIVE DATA ENGAGED.");
    } catch (error) {
        console.error("⚠️ SYNC FAILURE. ENGAGING SOVEREIGN FALLBACK:", error.message);
        // If API fails, we keep using the FALLBACK_RATES defined above
    }
}

// 3. INITIALIZE THE CONNECTION IMMEDIATELY
syncInterceptorRates();

/**
 * 4. THE CONVERSION LOGIC
 * Use this function throughout your app to get the latest values.
 */
function getConvertedAmount(amount, targetCurrency) {
    const target = LIVE_RATES[targetCurrency];
    if (!target) return amount; // Returns original if currency not found

    return (amount * target.rate).toFixed(2);
}
