// Configuration file for API keys and sensitive data
// IMPORTANT: Add this file to .gitignore to prevent committing API keys to version control

// Google Maps JavaScript API Configuration
// Export CONFIG to global window object for browser environment
window.CONFIG = {
    // Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key
    // Get your API key from: https://developers.google.com/maps/documentation/javascript/get-api-key
    
    // Optional: Other API configurations can be added here
    // GEOCODING_API_KEY: 'your_geocoding_api_key',
    // DIRECTIONS_API_KEY: 'your_directions_api_key',
    
    // Application settings
    APP_SETTINGS: {
        DEFAULT_CENTER: { lat: 53.00, lng: -2.00 }, // Center of UK
        DEFAULT_ZOOM: 6,
        MAX_ZOOM: 15
    }
};

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}