// Trefle API Configuration
const TREFLE_API_TOKEN = 'usr-setCY3KSTXxNypOr3m8dYpteOefesvxhM49lstjvXnI';
const TREFLE_API_BASE = 'https://trefle.io/api/v1';
const CORS_PROXY = 'https://corsproxy.io/?';

// Pixabay API Configuration
const PIXABAY_API_KEY = '53427977-ce53175693604ac67c49079cb';
const PIXABAY_API_BASE = 'https://pixabay.com/api/';

// Timeout for fetch requests (10 seconds)
const FETCH_TIMEOUT = 10000;

// Helper function to fetch with timeout
async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

// Common plants CSV cache
let commonPlantsMap = null;

// Load and parse the commonplants.csv file
async function loadCommonPlants() {
    if (commonPlantsMap !== null) {
        return commonPlantsMap; // Return cached data
    }

    try {
        const response = await fetchWithTimeout('commonplants.csv');
        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.status}`);
        }

        const csvText = await response.text();
        commonPlantsMap = new Map();

        // Parse CSV (skip header row)
        const lines = csvText.trim().split('\n');
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Handle CSV parsing - split by comma but respect the format
            const firstCommaIndex = line.indexOf(',');
            if (firstCommaIndex === -1) continue;

            const commonName = line.substring(0, firstCommaIndex).trim().toLowerCase();
            const scientificName = line.substring(firstCommaIndex + 1).trim();

            if (commonName && scientificName) {
                commonPlantsMap.set(commonName, scientificName);
            }
        }

        console.log('API: Loaded common plants CSV with', commonPlantsMap.size, 'entries');
        return commonPlantsMap;
    } catch (error) {
        console.error('Error loading common plants CSV:', error);
        commonPlantsMap = new Map(); // Set empty map to prevent repeated fetch attempts
        return commonPlantsMap;
    }
}

// Look up a common name in the CSV and return match info if found
async function lookupCommonName(query) {
    const plantsMap = await loadCommonPlants();
    const normalizedQuery = query.trim().toLowerCase();

    // Exact match
    if (plantsMap.has(normalizedQuery)) {
        const scientificName = plantsMap.get(normalizedQuery);
        // Find the original common name with proper casing
        let originalCommonName = query;
        for (const [key, value] of plantsMap) {
            if (key === normalizedQuery) {
                // Capitalize first letter of each word
                originalCommonName = key.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                break;
            }
        }
        console.log(`API: Found exact match for "${query}" -> "${scientificName}"`);
        return { scientificName, matchedCommonName: originalCommonName, matchType: 'exact' };
    }

    // Partial match - check if query is contained in any common name
    for (const [commonName, scientificName] of plantsMap) {
        if (commonName.includes(normalizedQuery) || normalizedQuery.includes(commonName)) {
            const originalCommonName = commonName.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            console.log(`API: Found partial match for "${query}" in "${commonName}" -> "${scientificName}"`);
            return { scientificName, matchedCommonName: originalCommonName, matchType: 'partial' };
        }
    }

    console.log(`API: No match found for "${query}" in CSV, using original query`);
    return null;
}

// Search for plants by query (common name or scientific name)
async function searchPlants(query) {
    console.log('API: Searching for:', query);
    
    if (!query || query.trim().length < 2) {
        return { plants: [], csvMatch: null, suggestedPlant: null };
    }

    try {
        // First, try to look up the common name in the CSV
        const csvMatch = await lookupCommonName(query);
        
        let suggestedPlant = null;
        
        // If we have a CSV match, fetch the suggested plant using the scientific name
        if (csvMatch) {
            console.log('API: Fetching suggested plant for:', csvMatch.scientificName);
            const suggestedApiUrl = `${TREFLE_API_BASE}/plants/search?token=${TREFLE_API_TOKEN}&q=${encodeURIComponent(csvMatch.scientificName)}`;
            const suggestedUrl = `${CORS_PROXY}${encodeURIComponent(suggestedApiUrl)}`;
            
            try {
                const suggestedResponse = await fetchWithTimeout(suggestedUrl);
                if (suggestedResponse.ok) {
                    const suggestedData = await suggestedResponse.json();
                    if (suggestedData.data && suggestedData.data.length > 0) {
                        const plant = suggestedData.data[0];
                        suggestedPlant = {
                            id: plant.id,
                            scientificName: plant.scientific_name,
                            commonName: plant.common_name || csvMatch.matchedCommonName,
                            slug: plant.slug,
                            family: plant.family,
                            genus: plant.genus,
                            imageUrl: plant.image_url
                        };
                        console.log('API: Found suggested plant:', suggestedPlant.scientificName);
                    }
                }
            } catch (error) {
                console.error('Error fetching suggested plant:', error);
            }
        }

        // Always search with the original query to get the 6 most likely results
        console.log('API: Searching with original query:', query);
        const apiUrl = `${TREFLE_API_BASE}/plants/search?token=${TREFLE_API_TOKEN}&q=${encodeURIComponent(query)}`;
        const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
        console.log('API: Fetching URL:', url);
        
        const response = await fetchWithTimeout(url);
        console.log('API: Response status:', response.status);
        
        if (!response.ok) {
            console.error(`API Error: ${response.status}`);
            return { plants: [], csvMatch, suggestedPlant };
        }

        const data = await response.json();
        console.log('API: Response data:', data);
        
        // Validate data structure
        if (!data || !data.data || !Array.isArray(data.data)) {
            console.error('API: Invalid response structure', data);
            return { plants: [], csvMatch, suggestedPlant };
        }
        
        // Return up to 6 results with relevant information
        const plants = data.data.slice(0, 6).map(plant => ({
            id: plant.id,
            scientificName: plant.scientific_name || 'Unknown',
            commonName: plant.common_name || 'Unknown',
            slug: plant.slug || '',
            family: plant.family || 'Unknown',
            genus: plant.genus || 'Unknown',
            imageUrl: plant.image_url || null
        }));

        // Fetch Pixabay images for plants without images
        await fetchMissingImages(plants);
        
        // Also fetch image for suggested plant if needed
        if (suggestedPlant && !suggestedPlant.imageUrl) {
            await fetchMissingImages([suggestedPlant]);
        }

        return { plants, csvMatch, suggestedPlant };
    } catch (error) {
        console.error('Error searching plants:', error);
        console.error('Error details:', error.message);
        // Return suggested plant if we have it, even if main search failed
        if (suggestedPlant) {
            return { plants: [], csvMatch, suggestedPlant };
        }
        return { plants: [], csvMatch: null, suggestedPlant: null };
    }
}

// Get detailed plant information by ID (basic)
async function getPlantDetails(plantId) {
    try {
        const apiUrl = `${TREFLE_API_BASE}/plants/${plantId}?token=${TREFLE_API_TOKEN}`;
        const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
        console.log('API: Fetching plant details for ID:', plantId);
        
        const response = await fetchWithTimeout(url);
        
        if (!response.ok) {
            console.error(`API: Plant details request failed with status ${response.status}`);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API: Plant data received:', data);
        
        // Validate data structure
        if (!data || !data.data) {
            console.error('API: Invalid plant data structure');
            throw new Error('Invalid data structure from API');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching plant details:', error);
        return null;
    }
}

// Get FULL species details including images, growth, specifications
async function getSpeciesDetails(plantId) {
    try {
        // First try species endpoint for complete data with images
        const apiUrl = `${TREFLE_API_BASE}/species/${plantId}?token=${TREFLE_API_TOKEN}`;
        const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
        console.log('API: Fetching species details for ID:', plantId);
        
        const response = await fetchWithTimeout(url);
        
        if (!response.ok) {
            console.warn(`API: Species endpoint failed with ${response.status}, trying plants endpoint`);
            // Fallback to plants endpoint if species endpoint fails
            return await getPlantDetails(plantId);
        }

        const data = await response.json();
        console.log('API: Species data received:', data.data);
        
        // Validate data structure
        if (!data || !data.data) {
            console.warn('API: Invalid species data structure, trying plants endpoint');
            return await getPlantDetails(plantId);
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching species details:', error);
        // Try fallback to plants endpoint
        console.log('API: Attempting fallback to plants endpoint');
        try {
            return await getPlantDetails(plantId);
        } catch (fallbackError) {
            console.error('API: Fallback also failed:', fallbackError);
            return null;
        }
    }
}

// Fetch image from Pixabay for a plant
async function fetchPixabayImage(searchTerm) {
    try {
        // Search for plant photos in the nature category
        const query = encodeURIComponent(searchTerm + ' plant');
        const url = `${PIXABAY_API_BASE}?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&category=nature&per_page=3&safesearch=true`;
        
        console.log('Pixabay: Searching for:', searchTerm);
        
        const response = await fetchWithTimeout(url);
        
        if (!response.ok) {
            throw new Error(`Pixabay API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.hits && data.hits.length > 0) {
            // Return the webformat URL (640px) which is good for thumbnails
            const imageUrl = data.hits[0].webformatURL;
            console.log('Pixabay: Found image for', searchTerm, '->', imageUrl);
            return imageUrl;
        }
        
        console.log('Pixabay: No image found for', searchTerm);
        return null;
    } catch (error) {
        console.error('Pixabay: Error fetching image:', error);
        return null;
    }
}

// Fetch multiple images from Pixabay for gallery
async function fetchPixabayImages(searchTerm, count = 5) {
    try {
        const query = encodeURIComponent(searchTerm + ' plant');
        const url = `${PIXABAY_API_BASE}?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&category=nature&per_page=${count}&safesearch=true`;
        
        console.log('Pixabay Gallery: Fetching', count, 'images for:', searchTerm);
        
        const response = await fetchWithTimeout(url);
        if (!response.ok) {
            console.log('Pixabay Gallery: API error', response.status);
            return [];
        }
        
        const data = await response.json();
        console.log('Pixabay Gallery: Got', data.hits?.length || 0, 'results');
        
        if (data.hits && data.hits.length > 0) {
            return data.hits.map(hit => ({
                url: hit.webformatURL,
                largeUrl: hit.largeImageURL,
                cat: 'pixabay'
            }));
        }
        return [];
    } catch (error) {
        console.error('Pixabay Gallery: Error fetching images:', error);
        return [];
    }
}

// Fetch missing images for an array of plants
async function fetchMissingImages(plants) {
    const plantsNeedingImages = plants.filter(plant => !plant.imageUrl);
    
    if (plantsNeedingImages.length === 0) {
        return;
    }
    
    console.log('Pixabay: Fetching images for', plantsNeedingImages.length, 'plants');
    
    // Fetch images in parallel for better performance
    const imagePromises = plantsNeedingImages.map(async (plant) => {
        // Try scientific name first, then common name
        let imageUrl = await fetchPixabayImage(plant.scientificName);
        
        if (!imageUrl && plant.commonName && plant.commonName !== 'Unknown') {
            imageUrl = await fetchPixabayImage(plant.commonName);
        }
        
        if (imageUrl) {
            plant.imageUrl = imageUrl;
            plant.imageSource = 'pixabay'; // Mark that this image came from Pixabay
        }
    });
    
    await Promise.all(imagePromises);
}
