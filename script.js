// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = this.getAttribute('href');
        const targetElement = document.querySelector(target);
        
        if (targetElement) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Skills Progress Animation
const animateSkills = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        const rect = bar.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 200);
        }
    });
};

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            
            // Animate skills when in view
            if (entry.target.classList.contains('skills-grid')) {
                animateSkills();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .testimonial-card, .stat-item, .skill-category');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
    
    // Initial skills animation
    animateSkills();
});

// Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to a server
        // For demo purposes, we'll just show a success message
        showNotification('Message sent successfully! I\'ll get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

// Recommendation Form Submission
const recommendationForm = document.getElementById('recommendationForm');
if (recommendationForm) {
    recommendationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('recName');
        const msgInput = document.getElementById('recMessage');
        const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Anonymous';
        const message = msgInput ? msgInput.value.trim() : '';

        if (!message) {
            showNotification('Please enter a message.', 'error');
            return;
        }

        const grid = document.querySelector('.testimonials-grid');
        if (grid) {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <div class="testimonial-content">
                    <p>"${escapeHtml(message)}"</p>
                </div>
                <div class="testimonial-author">
                    <div class="author-info">
                        <h4>${escapeHtml(name)}</h4>
                        <p>Recommendation</p>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }

        openRecommendationModal('Thank you for submitting a recommendation!');
        this.reset();
    });
}

function openRecommendationModal(message) {
    const modal = document.getElementById('recommendationModal');
    const modalMsg = document.getElementById('recommendationModalMessage');
    if (!modal) return;

    if (modalMsg) modalMsg.textContent = message;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    const closeBtn = document.getElementById('recommendationModalClose');
    if (closeBtn) closeBtn.focus();
}

function closeRecommendationModal() {
    const modal = document.getElementById('recommendationModal');
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('recommendationModal');
    if (!modal || !modal.classList.contains('is-open')) return;

    const closeBtn = e.target.closest('#recommendationModalClose');
    if (closeBtn) {
        closeRecommendationModal();
        return;
    }

    const overlay = e.target.closest('[data-modal-close="true"]');
    if (overlay) {
        closeRecommendationModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeRecommendationModal();
});

// Notification System
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Active Navigation Highlight
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Project Card Hover Effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Scroll-to-top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Console welcome message
console.log('%c Welcome to my Portfolio! ', 'background: #667eea; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c Built with HTML5, CSS3 & JavaScript ', 'background: #764ba2; color: white; font-size: 14px; padding: 8px; border-radius: 5px;');
