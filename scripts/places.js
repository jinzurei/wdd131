// Static weather data (in preparation for future API integration)
const temperature = 72; // °F
const windSpeed = 5; // km/h (converting to match your HTML)

/**
 * Calculates wind chill factor using the formula appropriate for the given units
 * @param {number} temp - Temperature in °F or °C
 * @param {number} speed - Wind speed in mph or km/h
 * @param {string} units - 'imperial' for °F/mph or 'metric' for °C/km/h
 * @returns {number} - Wind chill factor rounded to 1 decimal place
 */
function calculateWindChill(temp, speed, units = 'imperial') {
    if (units === 'metric') {
        // Metric formula: WC = 13.12 + 0.6215 × T - 11.37 × V^0.16 + 0.3965 × T × V^0.16
        return 13.12 + (0.6215 * temp) - (11.37 * Math.pow(speed, 0.16)) + (0.3965 * temp * Math.pow(speed, 0.16));
    } else {
        // Imperial formula: WC = 35.74 + 0.6215 × T - 35.75 × V^0.16 + 0.4275 × T × V^0.16
        return 35.74 + (0.6215 * temp) - (35.75 * Math.pow(speed, 0.16)) + (0.4275 * temp * Math.pow(speed, 0.16));
    }
}

/**
 * Checks if wind chill calculation conditions are met
 * @param {number} temp - Temperature
 * @param {number} speed - Wind speed
 * @param {string} units - 'imperial' or 'metric'
 * @returns {boolean} - True if conditions are met for wind chill calculation
 */
function isViableWindChill(temp, speed, units = 'imperial') {
    if (units === 'metric') {
        return temp <= 10 && speed > 4.8; // °C and km/h
    } else {
        return temp <= 50 && speed > 3; // °F and mph
    }
}

/**
 * Updates the wind chill display in the weather section
 */
function updateWindChill() {
    // Convert km/h to mph for calculation (since temperature is in °F)
    const windSpeedMph = windSpeed * 0.621371; // Convert km/h to mph
    
    let windChillValue;
    
    if (isViableWindChill(temperature, windSpeedMph, 'imperial')) {
        const windChill = calculateWindChill(temperature, windSpeedMph, 'imperial');
        windChillValue = `${Math.round(windChill * 10) / 10}°F`;
    } else {
        windChillValue = 'N/A';
    }
    
    // Update the wind chill value in the weather section
    const windChillElement = document.querySelector('.weather-item:last-child .value');
    if (windChillElement) {
        windChillElement.textContent = windChillValue;
    }
}

/**
 * Updates footer with current year and last modified date
 * Based on pattern from getdates.js
 */
function updateFooterDates() {
    // Update copyright year (assuming footer structure)
    const currentYear = new Date().getFullYear();
    const yearInFooter = document.querySelector('footer p');
    if (yearInFooter) {
        // Replace 2024 with current year
        yearInFooter.innerHTML = yearInFooter.innerHTML.replace('2024', currentYear);
    }
    
    // Update last modified date
    const modSpan = document.getElementById('lastModified');
    if (modSpan) {
        modSpan.textContent = document.lastModified;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateWindChill();
    updateFooterDates();
    
    // Log wind chill calculation details for debugging
    console.log(`Temperature: ${temperature}°F`);
    console.log(`Wind Speed: ${windSpeed} km/h (${(windSpeed * 0.621371).toFixed(1)} mph)`);
    console.log(`Wind Chill Conditions Met: ${isViableWindChill(temperature, windSpeed * 0.621371, 'imperial')}`);
});