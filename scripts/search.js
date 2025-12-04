// SVG icons
const binocularsOutline = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="binocular-icon" viewBox="0 0 16 16">
        <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h1A1.5 1.5 0 0 1 7 2.5V5h2V2.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5v2.382a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V14.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 14.5v-3a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5v3A1.5 1.5 0 0 1 5.5 16h-3A1.5 1.5 0 0 1 1 14.5V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882zM4.5 2a.5.5 0 0 0-.5.5V3h2v-.5a.5.5 0 0 0-.5-.5zM6 4H4v.882a1.5 1.5 0 0 1-.83 1.342l-.894.447A.5.5 0 0 0 2 7.118V13h4v-1.293l-.854-.853A.5.5 0 0 1 5 10.5v-1A1.5 1.5 0 0 1 6.5 8h3A1.5 1.5 0 0 1 11 9.5v1a.5.5 0 0 1-.146.354l-.854.853V13h4V7.118a.5.5 0 0 0-.276-.447l-.895-.447A1.5 1.5 0 0 1 12 4.882V4h-2v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm4-1h2v-.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm4 11h-4v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-8 0H2v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5z"/>
    </svg>
`;

const binocularsFilled = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="binocular-icon" viewBox="0 0 16 16">
        <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z"/>
    </svg>`;

// DOM elements
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const closeNav = document.getElementById('close-nav');
const searchIcon = document.getElementById('search-icon');
const plantSearch = document.getElementById('plant-search');
const plantInput = document.getElementById('plant-input');
const resultsContainer = document.getElementById('results-container');
const recentContainer = document.getElementById('recent-container');
const clearHistoryBtn = document.getElementById('clear-history');

let typingTimeout;
let trashSpinInterval = null;
let spinInterval;
let searchResults = [];
let selectedIndex = -1;

// Helper function to smoothly transition icons
function transitionIcon(newIcon, stateClass) {
    searchIcon.style.opacity = '0';
    searchIcon.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        searchIcon.innerHTML = newIcon;
        searchIcon.classList.remove('typing', 'searching', 'spinning');
        if (stateClass) {
            searchIcon.classList.add(stateClass);
        }
        searchIcon.style.opacity = '1';
        searchIcon.style.transform = 'scale(1)';
    }, 150);
}

// Function to trigger occasional spin
function triggerSpin() {
    searchIcon.classList.add('spinning');
    setTimeout(() => {
        searchIcon.classList.remove('spinning');
    }, 600);
}

// Start occasional spinning while typing
function startOccasionalSpinning() {
    clearInterval(spinInterval);
    // Randomly spin every 2-4 seconds
    spinInterval = setInterval(() => {
        if (searchIcon.classList.contains('typing')) {
            triggerSpin();
        }
    }, Math.random() * 2000 + 2000);
}

// Stop spinning
function stopOccasionalSpinning() {
    clearInterval(spinInterval);
}

// Display search results dropdown
function displayResults(plants, csvMatch = null, suggestedPlant = null) {
    searchResults = [];
    selectedIndex = -1;
    
    // Validate inputs
    if (!Array.isArray(plants)) {
        console.error('displayResults: plants is not an array', plants);
        plants = [];
    }
    
    if (plants.length === 0 && !suggestedPlant) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('visible');
        return;
    }
    
    let resultsHTML = '';
    let dataIndex = 0;
    
    // Add "Did you mean" suggestion if CSV match was found and we have a suggested plant
    if (csvMatch && suggestedPlant) {
        // Add suggested plant to searchResults first
        searchResults.push(suggestedPlant);
        
        resultsHTML += `
            <div class="did-you-mean-section">
                <div class="did-you-mean-header">
                    <span class="did-you-mean-icon">💡</span>
                    <span class="did-you-mean-text">Did you mean <strong>${csvMatch.matchedCommonName}</strong>?</span>
                </div>
                <div class="result-item suggested" data-index="${dataIndex}" role="option" aria-selected="false" tabindex="0">
                    <div class="result-names">
                        <span class="common-name">${suggestedPlant.commonName}</span>
                        <span class="scientific-name">${suggestedPlant.scientificName}</span>
                    </div>
                    <span class="suggested-badge">Recommended</span>
                </div>
            </div>
        `;
        dataIndex++;
        
        // Add separator for other results
        if (plants.length > 0) {
            resultsHTML += `<div class="other-results-header">Other Results</div>`;
        }
    }
    
    // Add all 6 results from the original query search
    resultsHTML += plants.map((plant, index) => {
        searchResults.push(plant);
        return `
            <div class="result-item" data-index="${dataIndex + index}" role="option" aria-selected="false" tabindex="0">
                <div class="result-names">
                    <span class="common-name">${plant.commonName}</span>
                    <span class="scientific-name">${plant.scientificName}</span>
                </div>
            </div>
        `;
    }).join('');
    
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.classList.add('visible');
    
    // Add click handlers to result items
    document.querySelectorAll('.result-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            navigateToResult(searchResults[index]);
        });
    });
}

// Navigate to result page with plant data
function navigateToResult(plant) {
    saveToRecentSearches(plant);
    window.location.href = `result.html?id=${plant.id}&name=${encodeURIComponent(plant.scientificName)}`;
}

// Save plant to recent searches in localStorage
function saveToRecentSearches(plant) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Remove if already exists (to move to front)
    recentSearches = recentSearches.filter(p => p.id !== plant.id);
    
    // Add to front
    recentSearches.unshift(plant);
    
    // Keep only 6 most recent
    recentSearches = recentSearches.slice(0, 6);
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    
    // Update display
    displayRecentSearches();
}

// Display recent searches
async function displayRecentSearches() {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    if (recentSearches.length === 0) {
        recentContainer.innerHTML = '<p class="no-recent">No recent searches yet. Start searching to see your history!</p>';
        return;
    }
    
    // Check if any plants are missing images
    const plantsNeedingImages = recentSearches.filter(plant => !plant.imageUrl);
    
    if (plantsNeedingImages.length > 0 && typeof fetchMissingImages === 'function') {
        console.log('Recent Searches: Fetching images for', plantsNeedingImages.length, 'plants');
        
        // Show loading state first
        recentContainer.innerHTML = recentSearches.map(plant => `
            <div class="plant-card" data-id="${plant.id}">
                <div class="plant-card-image">
                    ${plant.imageUrl ? 
                        `<img src="${plant.imageUrl}" alt="${plant.commonName}" loading="lazy">` : 
                        `<div class="no-image loading">⏳</div>`
                    }
                </div>
                <div class="plant-card-info">
                    <h3 class="card-common-name">${plant.commonName}</h3>
                    <p class="card-scientific-name">${plant.scientificName}</p>
                </div>
            </div>
        `).join('');
        
        // Fetch missing images
        await fetchMissingImages(plantsNeedingImages);
        
        // Update localStorage with new images
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        
        // Re-render cards with the newly fetched images
        renderRecentCards(recentSearches);
        return;
    }
    
    renderRecentCards(recentSearches);
}

// Render the recent search cards
function renderRecentCards(recentSearches) {
    const cardsHTML = recentSearches.map(plant => `
        <div class="plant-card" data-id="${plant.id}">
            <div class="plant-card-image">
                ${plant.imageUrl ? 
                    `<img src="${plant.imageUrl}" alt="${plant.commonName}" loading="lazy">
                     ${plant.imageSource === 'pixabay' ? '<span class="pixabay-credit">Fetched by Pixabay</span>' : ''}` : 
                    `<div class="no-image">🌿</div>`
                }
            </div>
            <div class="plant-card-info">
                <h3 class="card-common-name">${plant.commonName}</h3>
                <p class="card-scientific-name">${plant.scientificName}</p>
            </div>
        </div>
    `).join('');
    
    recentContainer.innerHTML = cardsHTML;
    
    // Add click handlers to cards
    document.querySelectorAll('.plant-card').forEach(card => {
        card.addEventListener('click', () => {
            const plantId = card.dataset.id;
            const plant = recentSearches.find(p => p.id === parseInt(plantId));
            if (plant) {
                navigateToResult(plant);
            }
        });
    });
}

// Perform search with debouncing
async function performSearch(query) {
    if (query.trim().length < 2) {
        displayResults([]);
        return;
    }
    
    try {
        // Show loading state
        resultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';
        resultsContainer.classList.add('visible');
        
        const result = await searchPlants(query);
        if (!result) {
            console.error('performSearch: searchPlants returned null/undefined');
            displayResults([]);
            return;
        }
        const { plants, csvMatch, suggestedPlant } = result;
        displayResults(plants || [], csvMatch, suggestedPlant);
    } catch (error) {
        console.error('performSearch: Error during search', error);
        // Show error message
        resultsContainer.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
        resultsContainer.classList.add('visible');
        setTimeout(() => {
            displayResults([]);
        }, 2000);
    }
}

// Hamburger menu
hamburger.addEventListener('click', () => {
    nav.classList.add('active');
});

closeNav.addEventListener('click', () => {
    nav.classList.remove('active');
});

// Toggle binocular icon on search
plantSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate minimum length
    if (plantInput.value.trim().length < 2) {
        plantInput.setCustomValidity('Please enter at least 2 characters');
        plantInput.reportValidity();
        return;
    }
    plantInput.setCustomValidity('');
    
    transitionIcon(binocularsFilled, 'searching');
    
    // Navigate to first result if available
    if (searchResults.length > 0) {
        navigateToResult(searchResults[0]);
    }
});

// Switch to filled icon when typing and perform search
plantInput.addEventListener('input', () => {
    const query = plantInput.value;
    
    if (query.length > 0 && !searchIcon.classList.contains('typing')) {
        transitionIcon(binocularsFilled, 'typing');
        startOccasionalSpinning();
    } else if (query.length === 0) {
        transitionIcon(binocularsOutline);
        stopOccasionalSpinning();
        displayResults([]);
        return;
    }
    
    // Debounce search
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        performSearch(query);
    }, 300);
});

// Handle keyboard navigation
plantInput.addEventListener('keydown', (e) => {
    if (!resultsContainer.classList.contains('visible')) return;
    
    const items = document.querySelectorAll('.result-item');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
        updateSelectedItem(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelectedItem(items);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        navigateToResult(searchResults[selectedIndex]);
    }
});

// Update visual selection in dropdown
function updateSelectedItem(items) {
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
            item.setAttribute('aria-selected', 'true');
        } else {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        }
    });
}

// Reset to outline when field loses focus
plantInput.addEventListener('blur', () => {
    // Delay to allow click events on results
    setTimeout(() => {
        if (plantInput.value === '') {
            transitionIcon(binocularsOutline);
            stopOccasionalSpinning();
        }
        resultsContainer.classList.remove('visible');
    }, 200);
});

// Show results again when focusing
plantInput.addEventListener('focus', () => {
    if (searchResults.length > 0 && plantInput.value.length >= 2) {
        resultsContainer.classList.add('visible');
    }
});

// Load recent searches on page load
displayRecentSearches();

// Trash icon SVGs
const trashOutline = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="trash-icon" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;

const trashFill = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="trash-icon" viewBox="0 0 16 16">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg>`;

// Trigger spin animation for trash icon
function triggerTrashSpin() {
    const trashIcon = clearHistoryBtn.querySelector('.trash-icon');
    if (trashIcon) {
        trashIcon.style.animation = 'none';
        setTimeout(() => {
            trashIcon.style.animation = 'binocularSpin 0.6s ease-in-out';
        }, 10);
    }
}

// Start occasional spinning for trash on hover
function startTrashSpinning() {
    if (trashSpinInterval) return;
    
    triggerTrashSpin();
    trashSpinInterval = setInterval(() => {
        triggerTrashSpin();
    }, Math.random() * 2000 + 2000);
}

// Stop occasional spinning for trash
function stopTrashSpinning() {
    if (trashSpinInterval) {
        clearInterval(trashSpinInterval);
        trashSpinInterval = null;
    }
}

// Clear history button hover handlers
clearHistoryBtn.addEventListener('mouseenter', () => {
    clearHistoryBtn.innerHTML = trashFill;
    startTrashSpinning();
});

clearHistoryBtn.addEventListener('mouseleave', () => {
    clearHistoryBtn.innerHTML = trashOutline;
    stopTrashSpinning();
});

// Clear history on click
clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('recentSearches');
    displayRecentSearches();
});
