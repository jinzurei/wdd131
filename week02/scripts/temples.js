// Set copyright year and last modified date in the footer
document.addEventListener('DOMContentLoaded', function () {
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