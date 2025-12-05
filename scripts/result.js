// Hamburger menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const closeNav = document.getElementById('close-nav');

hamburger.addEventListener('click', () => nav.classList.add('active'));
closeNav.addEventListener('click', () => nav.classList.remove('active'));

// Constants
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTH_FULL = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// Fun loading messages for the user
const LOADING_MESSAGES = [
    'Watching the grass grow...',
    'Waiting for seeds to sprout...',
    'Waiting for water to soak in...',
    'Checking the soil quality...',
    'Photosynthesizing data...',
    'Tending to the digital garden...',
    'Cultivating plant info...',
    'Nurturing your plant profile...',
    'Sprouting new details...',
    'Harvesting plant data...',
    'Letting the roots take hold...'
];

// Get plant info from URL
function getPlantInfoFromURL() {
    const params = new URLSearchParams(window.location.search);
    return { id: params.get('id'), name: params.get('name') };
}

// Show loading
function showLoading() {
    const randomMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    document.querySelector('.loading-text').textContent = randomMessage;
    document.getElementById('loading-container').style.display = 'block';
    document.getElementById('error-container').style.display = 'none';
    document.getElementById('plant-main').style.display = 'none';
}

// Show error
function showError(message = 'Plant not found') {
    document.getElementById('loading-container').style.display = 'none';
    document.getElementById('plant-main').style.display = 'none';
    document.getElementById('error-container').style.display = 'block';
    document.getElementById('error-message').textContent = message;
}

// Build segmented graph bar (like the reference image)
function buildStatRow(icon, label, value, maxValue = 10, customDisplay = null) {
    const row = document.createElement('div');
    row.className = 'stat-row';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'stat-icon';
    iconSpan.textContent = icon;
    const labelSpan = document.createElement('span');
    labelSpan.className = 'stat-label';
    labelSpan.textContent = label;
    const graphDiv = document.createElement('div');
    graphDiv.className = 'stat-graph';
    for (let i = 0; i < 10; i++) {
        const seg = document.createElement('div');
        seg.className = 'seg ' + ((value === null || value === undefined) ? 'empty' : (i < Math.round((value / maxValue) * 10) ? 'filled' : 'empty'));
        graphDiv.appendChild(seg);
    }
    const valSpan = document.createElement('span');
    valSpan.className = 'stat-val';
    valSpan.textContent = customDisplay || ((value === null || value === undefined) ? 'unknown' : `${value}/${maxValue}`);
    row.appendChild(iconSpan);
    row.appendChild(labelSpan);
    row.appendChild(graphDiv);
    row.appendChild(valSpan);
    return row;
}

// Build months calendar
function buildMonthsRow(label, activeMonths) {
    if (!activeMonths || activeMonths.length === 0) return null;
    const activeSet = new Set(activeMonths.map(m => m.toLowerCase()));
    const row = document.createElement('div');
    row.className = 'cal-row';
    const labelSpan = document.createElement('span');
    labelSpan.className = 'cal-label';
    labelSpan.textContent = label;
    const gridDiv = document.createElement('div');
    gridDiv.className = 'cal-grid';
    MONTHS.forEach((m, i) => {
        const cell = document.createElement('div');
        cell.className = 'mcell' + (activeSet.has(MONTH_FULL[i]) ? ' active' : '');
        cell.textContent = m;
        gridDiv.appendChild(cell);
    });
    row.appendChild(labelSpan);
    row.appendChild(gridDiv);
    return row;
}

// Build image gallery - Trefle images first, then fill in with Pixabay
async function buildGallery(images, plantName) {
    let trefleImages = [];
    if (images) {
        ['flower', 'leaf', 'habit', 'fruit', 'bark', 'other'].forEach(cat => {
            if (images[cat]) {
                images[cat].forEach(img => trefleImages.push({ url: img.image_url, cat, copyright: img.copyright }));
            }
        });
    }
    const pixabayCount = trefleImages.length === 0 ? 5 : 3;
    const maxTrefle = 8 - pixabayCount;
    let allImages = trefleImages.slice(0, maxTrefle);
    if (typeof fetchPixabayImages === 'function') {
        const pixaImages = await fetchPixabayImages(plantName, pixabayCount);
        pixaImages.forEach(img => allImages.push({ url: img.url, cat: 'pixabay', isPixabay: true }));
    }
    const galleryDiv = document.createElement('div');
    galleryDiv.className = 'gallery';
    if (allImages.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'empty-msg';
        msg.textContent = 'No images available';
        return msg;
    }
    allImages.forEach(img => {
        const item = document.createElement('div');
        item.className = 'gal-item';
        item.addEventListener('click', () => openLightbox(img.url));
        const image = document.createElement('img');
        image.src = img.url;
        image.alt = img.cat;
        image.loading = 'lazy';
        item.appendChild(image);
        const label = document.createElement('span');
        label.className = 'gal-label';
        label.textContent = img.cat;
        item.appendChild(label);
        const copy = document.createElement('span');
        copy.className = 'gal-copy';
        copy.textContent = img.isPixabay ? 'Pixabay' : (img.copyright || '');
        item.appendChild(copy);
        galleryDiv.appendChild(item);
    });
    // Lightbox is already in the HTML, just return the gallery
    return galleryDiv;
}

// Lightbox functions
function openLightbox(url) {
    document.getElementById('lightbox-img').src = url;
    document.getElementById('lightbox').classList.add('active');
    document.body.classList.add('lightbox-open');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.classList.remove('lightbox-open');
}

// Close lightbox when clicked
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', closeLightbox);
    }
});

// Build distribution - shows ALL regions
function buildDistribution(dist) {
    if (!dist) return null;
    const container = document.createElement('div');
    let hasContent = false;
    if (dist.native && dist.native.length > 0) {
        hasContent = true;
        const sec = document.createElement('div');
        sec.className = 'dist-sec';
        const title = document.createElement('span');
        title.className = 'dist-title';
        title.textContent = '🏠 Native:';
        sec.appendChild(title);
        const tags = document.createElement('div');
        tags.className = 'dist-tags';
        dist.native.forEach(r => {
            const tag = document.createElement('span');
            tag.className = 'dtag native';
            tag.textContent = r.name;
            tags.appendChild(tag);
        });
        sec.appendChild(tags);
        container.appendChild(sec);
    }
    if (dist.introduced && dist.introduced.length > 0) {
        hasContent = true;
        const sec = document.createElement('div');
        sec.className = 'dist-sec';
        const title = document.createElement('span');
        title.className = 'dist-title';
        title.textContent = '✈️ Introduced:';
        sec.appendChild(title);
        const tags = document.createElement('div');
        tags.className = 'dist-tags';
        dist.introduced.forEach(r => {
            const tag = document.createElement('span');
            tag.className = 'dtag intro';
            tag.textContent = r.name;
            tags.appendChild(tag);
        });
        sec.appendChild(tags);
        container.appendChild(sec);
    }
    if (!hasContent) {
        const msg = document.createElement('p');
        msg.className = 'empty-msg';
        msg.textContent = 'No distribution data';
        container.appendChild(msg);
    }
    return container;
}

// Set up tab switching
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });
}

// Main display function
async function displayPlant(plant) {
    document.getElementById('loading-container').style.display = 'none';
    document.getElementById('error-container').style.display = 'none';
    document.getElementById('plant-main').style.display = 'block';

    const name = plant.common_name || 'Unknown';
    const sciName = plant.scientific_name || 'Unknown';
    const family = plant.family || 'Unknown';
    const genus = plant.genus || 'Unknown';
    const duration = plant.duration || [];
    const edible = plant.edible;
    const observations = plant.observations || '';
    const specs = plant.specifications || {};
    const growth = plant.growth || {};
    const foliage = plant.foliage || {};

    // Hero section
    document.getElementById('plant-common-name').textContent = name;
    document.getElementById('plant-sci-name').textContent = sciName;
    // Tags
    const tagsDiv = document.getElementById('plant-tags');
    tagsDiv.innerHTML = '';
    const familyTag = document.createElement('span');
    familyTag.className = 'tag';
    familyTag.textContent = family;
    tagsDiv.appendChild(familyTag);
    duration.forEach(d => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = d;
        tagsDiv.appendChild(tag);
    });
    if (edible) {
        const tag = document.createElement('span');
        tag.className = 'tag good';
        tag.textContent = 'Edible';
        tagsDiv.appendChild(tag);
    }
    if (specs.toxicity && specs.toxicity !== 'none') {
        const tag = document.createElement('span');
        tag.className = 'tag bad';
        tag.textContent = specs.toxicity + ' toxicity';
        tagsDiv.appendChild(tag);
    }
    // Image
    let imgUrl = plant.image_url;
    let imgSource = '';
    if (!imgUrl && typeof fetchPixabayImage === 'function') {
        imgUrl = await fetchPixabayImage(sciName);
        if (!imgUrl && name !== 'Unknown') imgUrl = await fetchPixabayImage(name);
        if (imgUrl) imgSource = 'pixabay';
    }
    const imgEl = document.getElementById('plant-img');
    const imgCredit = document.getElementById('img-credit');
    const noImg = document.getElementById('no-img');
    if (imgUrl) {
        imgEl.src = imgUrl;
        imgEl.alt = name;
        imgEl.style.display = 'block';
        noImg.style.display = 'none';
        imgCredit.style.display = imgSource === 'pixabay' ? 'inline' : 'none';
        imgCredit.textContent = imgSource === 'pixabay' ? 'Image from Pixabay' : '';
    } else {
        imgEl.style.display = 'none';
        imgCredit.style.display = 'none';
        noImg.style.display = 'flex';
    }

    // Basic Info
    const basicInfoList = document.getElementById('basic-info-list');
    basicInfoList.innerHTML = '';
    [
        ['Family', family],
        ['Genus', genus],
        ['Duration', duration.length ? duration.join(', ') : 'Unknown'],
        ['Edible', edible === true ? 'Yes' : edible === false ? 'No' : 'Unknown']
    ].forEach(([label, value]) => {
        const row = document.createElement('div');
        row.className = 'info-row';
        const span = document.createElement('span');
        span.textContent = label;
        const strong = document.createElement('strong');
        strong.textContent = value;
        row.appendChild(span);
        row.appendChild(strong);
        basicInfoList.appendChild(row);
    });

    // Observations & Distribution
    const obsDistCard = document.getElementById('obs-dist-card');
    if (observations || plant.distributions) {
        obsDistCard.style.display = 'block';
        document.getElementById('plant-observations').textContent = observations;
        const distDiv = document.getElementById('plant-distribution');
        distDiv.innerHTML = '';
        const distContent = buildDistribution(plant.distributions);
        if (distContent) distDiv.appendChild(distContent);
    } else {
        obsDistCard.style.display = 'none';
    }

    // Synonyms
    const synonymsCard = document.getElementById('synonyms-card');
    if (plant.synonyms && plant.synonyms.length > 0) {
        synonymsCard.style.display = 'block';
        const synList = document.getElementById('plant-synonyms');
        synList.innerHTML = '';
        plant.synonyms.slice(0, 6).forEach(s => {
            const syn = document.createElement('span');
            syn.className = 'syn';
            syn.textContent = s.name;
            synList.appendChild(syn);
        });
    } else {
        synonymsCard.style.display = 'none';
    }

    // Growing & Specs Tab
    // Light & Water
    const lightWaterRows = document.getElementById('light-water-rows');
    lightWaterRows.innerHTML = '';
    lightWaterRows.appendChild(buildStatRow('☀️', 'Light', growth.light));
    lightWaterRows.appendChild(buildStatRow('💨', 'Atmospheric Humidity', growth.atmospheric_humidity));
    lightWaterRows.appendChild(buildStatRow('💧', 'Soil Humidity', growth.soil_humidity));
    // Soil
    const soilRows = document.getElementById('soil-rows');
    soilRows.innerHTML = '';
    soilRows.appendChild(buildStatRow('🌱', 'Soil Nutriments', growth.soil_nutriments));
    soilRows.appendChild(buildStatRow('🧂', 'Soil Salinity', growth.soil_salinity));
    soilRows.appendChild(buildStatRow('🏜️', 'Soil Texture', growth.soil_texture));
    // pH - need to convert range to a single value for the graph
    let phValue = null;
    let phDisplay = 'unknown';
    if (growth.ph_minimum !== undefined && growth.ph_minimum !== null && 
        growth.ph_maximum !== undefined && growth.ph_maximum !== null) {
        phValue = (growth.ph_minimum + growth.ph_maximum) / 2;
        phDisplay = `${growth.ph_minimum.toFixed(1)} - ${growth.ph_maximum.toFixed(1)}`;
    } else if (growth.ph_minimum !== undefined && growth.ph_minimum !== null) {
        phValue = growth.ph_minimum;
        phDisplay = `${growth.ph_minimum.toFixed(1)}`;
    } else if (growth.ph_maximum !== undefined && growth.ph_maximum !== null) {
        phValue = growth.ph_maximum;
        phDisplay = `${growth.ph_maximum.toFixed(1)}`;
    }
    soilRows.appendChild(buildStatRow('🧪', 'pH Range', phValue, 14, phDisplay));
    // Remove the old pH row element since we're adding it to soilRows now
    const phRow = document.getElementById('ph-row');
    phRow.style.display = 'none';
    // Size & Growth
    const specsGrid = document.getElementById('specs-grid');
    specsGrid.innerHTML = '';
    if (specs.average_height?.cm) {
        const spec = document.createElement('div');
        spec.className = 'spec';
        spec.innerHTML = '<span>Avg Height</span><strong>' + specs.average_height.cm + ' cm</strong>';
        specsGrid.appendChild(spec);
    }
    if (specs.maximum_height?.cm) {
        const spec = document.createElement('div');
        spec.className = 'spec';
        spec.innerHTML = '<span>Max Height</span><strong>' + specs.maximum_height.cm + ' cm</strong>';
        specsGrid.appendChild(spec);
    }
    if (growth.spread?.cm) {
        const spec = document.createElement('div');
        spec.className = 'spec';
        spec.innerHTML = '<span>Spread</span><strong>' + growth.spread.cm + ' cm</strong>';
        specsGrid.appendChild(spec);
    }
    if (specs.growth_rate) {
        const spec = document.createElement('div');
        spec.className = 'spec';
        spec.innerHTML = '<span>Growth Rate</span><strong>' + specs.growth_rate + '</strong>';
        specsGrid.appendChild(spec);
    }
    if (specs.growth_habit) {
        const spec = document.createElement('div');
        spec.className = 'spec';
        spec.innerHTML = '<span>Habit</span><strong>' + specs.growth_habit + '</strong>';
        specsGrid.appendChild(spec);
    }
    if (foliage.texture) {
        const spec = document.createElement('div');
        spec.className = 'spec';
        spec.innerHTML = '<span>Foliage</span><strong>' + foliage.texture + '</strong>';
        specsGrid.appendChild(spec);
    }
    // Calendar
    const calendarCard = document.getElementById('calendar-card');
    const calendarRows = document.getElementById('calendar-rows');
    calendarRows.innerHTML = '';
    let hasCalendar = false;
    if (growth.bloom_months) {
        const row = buildMonthsRow('Bloom', growth.bloom_months);
        if (row) { calendarRows.appendChild(row); hasCalendar = true; }
    }
    if (growth.growth_months) {
        const row = buildMonthsRow('Growth', growth.growth_months);
        if (row) { calendarRows.appendChild(row); hasCalendar = true; }
    }
    if (growth.fruit_months) {
        const row = buildMonthsRow('Fruit', growth.fruit_months);
        if (row) { calendarRows.appendChild(row); hasCalendar = true; }
    }
    calendarCard.style.display = hasCalendar ? 'block' : 'none';
    // Temperature
    const tempCard = document.getElementById('temp-card');
    const tempList = document.getElementById('temp-list');
    tempList.innerHTML = '';
    if (growth.minimum_temperature?.deg_c !== undefined) {
        const row = document.createElement('div');
        row.className = 'info-row';
        const span = document.createElement('span');
        span.textContent = 'Min Temp';
        const strong = document.createElement('strong');
        strong.textContent = (growth.minimum_temperature.deg_c !== null) 
            ? Math.round(growth.minimum_temperature.deg_c * 9/5 + 32) + '°F' 
            : 'unknown';
        row.appendChild(span);
        row.appendChild(strong);
        tempList.appendChild(row);
    }
    if (growth.maximum_temperature?.deg_c !== undefined) {
        const row = document.createElement('div');
        row.className = 'info-row';
        const span = document.createElement('span');
        span.textContent = 'Max Temp';
        const strong = document.createElement('strong');
        strong.textContent = (growth.maximum_temperature.deg_c !== null) 
            ? Math.round(growth.maximum_temperature.deg_c * 9/5 + 32) + '°F' 
            : 'unknown';
        row.appendChild(span);
        row.appendChild(strong);
        tempList.appendChild(row);
    }
    tempCard.style.display = 'block';

    // Tabs
    initTabs();

    // Gallery
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = '<p class="loading-text">Loading images...</p>';
    const galleryContent = await buildGallery(plant.images, sciName);
    galleryContainer.innerHTML = '';
    galleryContainer.appendChild(galleryContent);
}

// Load on page load
document.addEventListener('DOMContentLoaded', async () => {
    const { id } = getPlantInfoFromURL();
    
    if (!id) {
        showError('No plant specified');
        return;
    }
    
    console.log('Result page: Loading plant ID:', id);
    showLoading();
    
    // Give the loading animation time to show - looks better
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        const plant = await getSpeciesDetails(id);
        console.log('Result page: Plant data received:', plant);
        
        if (!plant) {
            console.error('Result page: No plant data returned from API');
            await minLoadTime; // Wait for animation
            showError('Could not load plant details. The plant may not be available in our database.');
            return;
        }
        
        await minLoadTime; // Wait for animation to complete
        await displayPlant(plant);
    } catch (error) {
        console.error('Result page: Error loading plant:', error);
        await minLoadTime; // Wait for animation even on error
        showError('Error loading plant details: ' + error.message);
    }
});
