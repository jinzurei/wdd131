// Temple data array
const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  {
    templeName: "Salt Lake",
    location: "Salt Lake City, Utah, United States",
    dedicated: "1893, April, 6",
    area: 253015,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/salt-lake-city-utah/400x250/salt-lake-temple-37762.jpg"
  },
  {
    templeName: "Tokyo Japan",
    location: "Tokyo, Japan",
    dedicated: "1980, October, 27",
    area: 53997,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/tokyo-japan-temple/tokyo-japan-temple-26340-main.jpg"
  },
  {
    templeName: "Rome Italy", 
    location: "Rome, Italy",
    dedicated: "2019, March, 10",
    area: 41000,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/rome-italy-temple/rome-italy-temple-2642-main.jpg"
  }
];

// Function to create temple cards
function createTempleCard(temple) {
  const figure = document.createElement('figure');
  
  const img = document.createElement('img');
  img.src = temple.imageUrl;
  img.alt = `${temple.templeName} Temple`;
  img.loading = 'lazy';
  
  const figcaption = document.createElement('figcaption');
  figcaption.innerHTML = `
    <h3>${temple.templeName}</h3>
    <p><strong>Location:</strong> ${temple.location}</p>
    <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
    <p><strong>Area:</strong> ${temple.area.toLocaleString()} sq ft</p>
  `;
  
  figure.appendChild(img);
  figure.appendChild(figcaption);
  
  return figure;
}

// Function to display temple cards
function displayTemples(templeArray) {
  const container = document.getElementById('temple-container');
  container.innerHTML = ''; // Clear existing content
  
  templeArray.forEach(temple => {
    const templeCard = createTempleCard(temple);
    container.appendChild(templeCard);
  });
}

// Filter functions for different categories
function filterOldTemples() {
  return temples.filter(temple => {
    const year = parseInt(temple.dedicated.split(',')[0]);
    return year < 1900;
  });
}

function filterNewTemples() {
  return temples.filter(temple => {
    const year = parseInt(temple.dedicated.split(',')[0]);
    return year > 2000;
  });
}

function filterLargeTemples() {
  return temples.filter(temple => temple.area > 90000);
}

function filterSmallTemples() {
  return temples.filter(temple => temple.area < 10000);
}

// Function to update page title and display filtered temples
function updatePageAndDisplay(filteredTemples, title) {
  const mainTitle = document.querySelector('main h1');
  if (mainTitle) {
    mainTitle.textContent = title;
  }
  displayTemples(filteredTemples);
}

// Set copyright year and last modified date in the footer
document.addEventListener('DOMContentLoaded', function () {
  // Display all temples on page load
  displayTemples(temples);
  
  // Add navigation event listeners
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      this.classList.add('active');
      
      // Get the filter type from data-filter attribute
      const filter = this.getAttribute('data-filter');
      
      switch(filter) {
        case 'home':
          updatePageAndDisplay(temples, 'Home');
          break;
        case 'old':
          updatePageAndDisplay(filterOldTemples(), 'Old');
          break;
        case 'new':
          updatePageAndDisplay(filterNewTemples(), 'New');
          break;
        case 'large':
          updatePageAndDisplay(filterLargeTemples(), 'Large');
          break;
        case 'small':
          updatePageAndDisplay(filterSmallTemples(), 'Small');
          break;
        default:
          updatePageAndDisplay(temples, 'Home');
      }
    });
  });
  
  // Footer copyright year - dynamically set current year
  const yearSpan = document.getElementById('copyright-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // Footer last modified date - format the document's last modified date
  const modSpan = document.getElementById('lastModified');
  if (modSpan) {
    const lastModified = new Date(document.lastModified);
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    modSpan.textContent = `Last Modified: ${lastModified.toLocaleDateString('en-US', options)}`;
  }

  // Enhanced mobile hamburger menu functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (menuToggle && nav) {
    // Set initial hamburger symbol and ensure it's visible
    menuToggle.innerHTML = '&#9776;'; // Hamburger symbol ☰
    menuToggle.style.display = 'flex'; // Ensure it's visible
    
    console.log('Hamburger menu initialized'); // Debug log
    
    // Function to handle responsive navigation
    function handleResize() {
      if (window.innerWidth >= 1000) {
        // Desktop: Hide hamburger, show nav, remove mobile classes
        nav.classList.remove('show');
        menuToggle.innerHTML = '&#9776;';
        menuToggle.setAttribute('aria-label', 'Open menu');
      } else {
        // Mobile/Tablet: Ensure hamburger is visible
        menuToggle.style.display = 'flex';
      }
    }
    
    // Run on page load
    handleResize();
    
    // Run on window resize
    window.addEventListener('resize', handleResize);
    
    menuToggle.addEventListener('click', function() {
      console.log('Hamburger clicked'); // Debug log
      
      // Only work if we're in mobile mode
      if (window.innerWidth < 1000) {
        // Toggle navigation visibility
        nav.classList.toggle('show');
        
        // Toggle hamburger/close symbol
        if (nav.classList.contains('show')) {
          menuToggle.innerHTML = '&#10005;'; // X symbol ✕
          menuToggle.setAttribute('aria-label', 'Close menu');
        } else {
          menuToggle.innerHTML = '&#9776;'; // Hamburger symbol ☰
          menuToggle.setAttribute('aria-label', 'Open menu');
        }
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        if (nav.classList.contains('show')) {
          nav.classList.remove('show');
          menuToggle.innerHTML = '&#9776;'; // Reset to hamburger
          menuToggle.setAttribute('aria-label', 'Open menu');
        }
      }
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && nav.classList.contains('show')) {
        nav.classList.remove('show');
        menuToggle.innerHTML = '&#9776;'; // Reset to hamburger
        menuToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }
});