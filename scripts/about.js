// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const closeNav = document.getElementById('close-nav');

hamburger.addEventListener('click', () => {
    nav.classList.add('active');
});

closeNav.addEventListener('click', () => {
    nav.classList.remove('active');
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Create submission object
        const submission = {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        // Store in localStorage (simulating form submission)
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
        // Show success message
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
        
        // Reset form
        contactForm.reset();
    });
}
