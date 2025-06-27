// PestPro Solutions - Main JavaScript File
// Professional Pest Control Website Functionality

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== NAVIGATION FUNCTIONALITY =====
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle hash links on the same page
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Active navigation highlighting
    function updateActiveNav() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // ===== APPOINTMENT MODAL FUNCTIONALITY =====
    const appointmentButtons = document.querySelectorAll('.book-appointment-btn');
    const appointmentModal = document.getElementById('appointmentModal');
    const appointmentForm = document.getElementById('appointmentForm');

    // Initialize appointment modal
    function initAppointmentModal() {
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', handleAppointmentSubmission);
            
            // Set minimum date to today
            const dateInput = appointmentForm.querySelector('#preferredDate');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.setAttribute('min', today);
            }
        }

        // Add click handlers to all appointment buttons
        appointmentButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Pre-fill service type if specified
                const serviceType = this.getAttribute('data-service');
                if (serviceType && appointmentForm) {
                    const serviceSelect = appointmentForm.querySelector('#serviceType');
                    if (serviceSelect) {
                        serviceSelect.value = serviceType;
                    }
                }
            });
        });
    }

    // Handle appointment form submission
    function handleAppointmentSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(appointmentForm);
        const appointmentData = {
            firstName: formData.get('firstName') || document.getElementById('firstName')?.value,
            lastName: formData.get('lastName') || document.getElementById('lastName')?.value,
            phone: formData.get('phone') || document.getElementById('phone')?.value,
            email: formData.get('email') || document.getElementById('email')?.value,
            address: formData.get('address') || document.getElementById('address')?.value,
            serviceType: formData.get('serviceType') || document.getElementById('serviceType')?.value,
            preferredDate: formData.get('preferredDate') || document.getElementById('preferredDate')?.value,
            description: formData.get('description') || document.getElementById('description')?.value
        };

        // Validate required fields
        if (!appointmentData.firstName || !appointmentData.lastName || 
            !appointmentData.phone || !appointmentData.email || 
            !appointmentData.address || !appointmentData.serviceType) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Validate email format
        if (!isValidEmail(appointmentData.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Validate phone format
        if (!isValidPhone(appointmentData.phone)) {
            showNotification('Please enter a valid phone number.', 'error');
            return;
        }

        // Show loading state
        const submitButton = appointmentForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Booking...';
        submitButton.disabled = true;

        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            // Reset form and close modal
            appointmentForm.reset();
            const modal = bootstrap.Modal.getInstance(appointmentModal);
            if (modal) {
                modal.hide();
            }

            // Show success message
            showNotification('Appointment request submitted successfully! We\'ll contact you within 2 hours.', 'success');

            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Optional: Send data to backend
            console.log('Appointment Data:', appointmentData);
            
        }, 2000);
    }

    // ===== FORM VALIDATION UTILITIES =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: none;
            border-radius: 8px;
        `;

        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    'fa-info-circle';

        notification.innerHTML = `
            <i class="fas ${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ===== LOADING STATES =====
    function showLoadingState(element) {
        element.classList.add('loading');
        element.style.position = 'relative';
    }

    function hideLoadingState(element) {
        element.classList.remove('loading');
    }

    // ===== PHONE NUMBER FORMATTING =====
    function initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
                }
                
                e.target.value = value;
            });
        });
    }

    // ===== DATE INPUT ENHANCEMENTS =====
    function initDateInputs() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        
        dateInputs.forEach(input => {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            input.setAttribute('min', today);
            
            // Set maximum date to 3 months from now
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            input.setAttribute('max', maxDate.toISOString().split('T')[0]);
        });
    }

    // ===== TESTIMONIALS CAROUSEL (if implemented) =====
    function initTestimonials() {
        const testimonialsContainer = document.querySelector('.testimonials');
        if (!testimonialsContainer) return;

        // Add hover pause functionality for any carousels
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(carousel => {
            carousel.addEventListener('mouseenter', () => {
                const bsCarousel = bootstrap.Carousel.getInstance(carousel);
                if (bsCarousel) bsCarousel.pause();
            });

            carousel.addEventListener('mouseleave', () => {
                const bsCarousel = bootstrap.Carousel.getInstance(carousel);
                if (bsCarousel) bsCarousel.cycle();
            });
        });
    }

    // ===== ACCORDION ENHANCEMENTS =====
    function initAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        accordionItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const collapse = item.querySelector('.accordion-collapse');
            
            if (button && collapse) {
                button.addEventListener('click', function() {
                    // Smooth scroll to accordion item when opened
                    setTimeout(() => {
                        if (!button.classList.contains('collapsed')) {
                            item.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'nearest' 
                            });
                        }
                    }, 300);
                });
            }
        });
    }

    // ===== LAZY LOADING FOR IMAGES =====
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // ===== SERVICE CARD INTERACTIONS =====
    function initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card, .additional-service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // ===== EMERGENCY CONTACT HIGHLIGHTING =====
    function initEmergencyContact() {
        const emergencyLinks = document.querySelectorAll('a[href^="tel:"]');
        
        emergencyLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Track emergency call clicks (analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'emergency_call', {
                        'event_category': 'engagement',
                        'event_label': 'phone_click'
                    });
                }
            });
        });
    }

    // ===== PERFORMANCE MONITORING =====
    function initPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', function() {
            if ('performance' in window) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
                
                // Track slow loading pages
                if (loadTime > 3000) {
                    console.warn('Slow page load detected');
                }
            }
        });
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    function initAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only sr-only-focusable';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            width: 1px;
            height: 1px;
            padding: 8px 16px;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
            z-index: 10000;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.cssText = `
                position: absolute;
                top: 6px;
                left: 6px;
                width: auto;
                height: auto;
                padding: 8px 16px;
                margin: 0;
                overflow: visible;
                clip: auto;
                background: #000;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
            `;
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID if not present
        const main = document.querySelector('main') || document.querySelector('.hero-section');
        if (main && !main.id) {
            main.id = 'main-content';
        }

        // Keyboard navigation for modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    const modal = bootstrap.Modal.getInstance(openModal);
                    if (modal) modal.hide();
                }
            }
        });
    }

    // ===== ERROR HANDLING =====
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('JavaScript error:', e.error);
            // Could send to error tracking service
        });

        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
            // Could send to error tracking service
        });
    }

    // ===== INITIALIZATION =====
    function init() {
        try {
            // Core functionality
            handleNavbarScroll();
            updateActiveNav();
            initSmoothScrolling();
            initAppointmentModal();
            
            // Form enhancements
            initPhoneFormatting();
            initDateInputs();
            
            // UI enhancements
            initScrollAnimations();
            initServiceCards();
            initTestimonials();
            initAccordion();
            initLazyLoading();
            
            // Accessibility and performance
            initAccessibility();
            initEmergencyContact();
            initPerformanceMonitoring();
            initErrorHandling();
            
            console.log('PestPro Solutions website initialized successfully');
            
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    // Event listeners
    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('resize', function() {
        // Handle responsive changes
        updateActiveNav();
    });

    // Initialize everything
    init();

    // ===== PUBLIC API =====
    // Expose useful functions globally
    window.PestPro = {
        showNotification,
        showLoadingState,
        hideLoadingState,
        isValidEmail,
        isValidPhone
    };
});

// ===== UTILITY FUNCTIONS =====

// Debounce utility for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle utility for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Cookie utility functions
const CookieUtils = {
    set: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    
    get: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    delete: function(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

// Local storage utility with fallback
const StorageUtils = {
    isSupported: function() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    },
    
    set: function(key, value) {
        if (this.isSupported()) {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            CookieUtils.set(key, JSON.stringify(value), 30);
        }
    },
    
    get: function(key) {
        if (this.isSupported()) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } else {
            const item = CookieUtils.get(key);
            return item ? JSON.parse(item) : null;
        }
    },
    
    remove: function(key) {
        if (this.isSupported()) {
            localStorage.removeItem(key);
        } else {
            CookieUtils.delete(key);
        }
    }
};
