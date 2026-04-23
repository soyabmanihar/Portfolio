// ========== JAVASCRIPT FUNCTIONALITY ========== 

// ===== 1. NAVBAR TOGGLE FOR MOBILE =====
// Get elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Function to check if mobile menu is active
function isMobile() {
    return window.innerWidth <= 576 || hamburger.style.display !== 'none';
}

// Toggle menu when hamburger is clicked
hamburger.addEventListener('click', () => {
    const isOpen = navMenu.style.display === 'flex';
    navMenu.style.display = isOpen ? 'none' : 'flex';
    hamburger.classList.toggle('active');
    
    // Accessibility: Update aria-expanded attribute
    hamburger.setAttribute('aria-expanded', !isOpen);
});

// Close menu when a link is clicked (only on mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMobile()) {
            navMenu.style.display = 'none';
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

// Close menu when clicking outside (only on mobile)
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && isMobile()) {
        navMenu.style.display = 'none';
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Reset menu display on window resize
window.addEventListener('resize', () => {
    // If window is resized to desktop, remove inline styles
    if (window.innerWidth > 576) {
        navMenu.style.display = '';
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});


// ===== 2. SMOOTH SCROLLING =====
// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the target section ID
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Smooth scroll to the element
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ===== 3. SCROLL ANIMATIONS (Fade-in effect) =====
// Debounce function for better performance
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Create an Intersection Observer to trigger animations on scroll
const observerOptions = {
    threshold: 0.1,          // Trigger when 10% of element is visible
    rootMargin: '0px 0px -100px 0px'  // Add margin for better timing
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // If element is visible
        if (entry.isIntersecting) {
            // Add visible class for fade-in animation
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Stop observing this element after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles and observe all sections and cards
const elementsToAnimate = document.querySelectorAll(
    '.about, .projects, .contact, .project-card, .skill-card, .about-text'
);

elementsToAnimate.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});


// ===== 4. FORM VALIDATION & HANDLING =====
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Add form submission handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
        showError('Please fill out all fields!');
        return;
    }
    
    // Email validation (simple check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address!');
        return;
    }
    
    // Name must be at least 2 characters
    if (name.length < 2) {
        showError('Please enter a valid name!');
        return;
    }
    
    // Message must be at least 10 characters
    if (message.length < 10) {
        showError('Please write a longer message (at least 10 characters)!');
        return;
    }
    
    // If validation passes, show success message
    // (In a real app, you'd send this to a server)
    showSuccessMessage();
    
    // Reset form
    contactForm.reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        hideSuccessMessage();
    }, 5000);
});

// Function to show success message
function showSuccessMessage() {
    successMessage.classList.add('show');
    successMessage.style.display = 'block';
    console.log('✅ Form submitted successfully!');
}

// Function to hide success message
function hideSuccessMessage() {
    successMessage.classList.remove('show');
    successMessage.style.display = 'none';
}

// Function to show error (using browser alert)
function showError(message) {
    alert('⚠️ ' + message);
}


// ===== 5. ACTIVE NAVBAR LINK ON SCROLL =====
// Update active nav link based on current section
const updateActiveLink = debounce(() => {
    let current = '';
    
    // Get all sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // If user has scrolled into this section
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active link styling
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}, 50);

window.addEventListener('scroll', updateActiveLink);


// ===== 6. CTA BUTTON SCROLL TO PROJECTS =====
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}


// ===== 7. PAGE LOAD ANIMATION =====
// Log when page is loaded
window.addEventListener('load', () => {
    console.log('✅ Portfolio website loaded successfully!');
});


// ===== 8. PREFERRED REDUCED MOTION =====
// Respect user's motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}


// ===== 9. KEYBOARD NAVIGATION =====
// Handle Escape key to close mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.style.display = 'none';
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});


// ===== 10. CONSOLE MESSAGE =====
// Fun message in console for developers
console.log('%c 🎨 Welcome to my Portfolio! ', 'background: #00c6ff; color: #0f2027; font-size: 16px; padding: 10px; border-radius: 5px; font-weight: bold;');
console.log('%c Built with HTML, CSS & JavaScript ', 'background: #2c5364; color: #00c6ff; font-size: 12px; padding: 5px; border-radius: 3px;');
console.log('%c Made with ❤️ ', 'color: #ff6b6b; font-size: 12px; font-weight: bold;');
