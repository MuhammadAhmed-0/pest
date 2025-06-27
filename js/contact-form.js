// PestPro Solutions - Contact Form Handler
// Enhanced contact form functionality with validation and submission

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.log('Contact form not found on this page');
        return;
    }

    // ===== FORM CONFIGURATION =====
    const CONFIG = {
        emailEndpoint: '/api/contact', // Replace with actual endpoint
        maxMessageLength: 1000,
        requiredFields: ['contactFirstName', 'contactLastName', 'contactPhone', 'contactEmail', 'contactMessage'],
        phoneRegex: /^[\+]?[1-9][\d]{0,15}$/,
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    // ===== FORM ELEMENTS =====
    const formElements = {
        firstName: document.getElementById('contactFirstName'),
        lastName: document.getElementById('contactLastName'),
        phone: document.getElementById('contactPhone'),
        email: document.getElementById('contactEmail'),
        address: document.getElementById('contactAddress'),
        service: document.getElementById('contactService'),
        urgency: document.getElementById('contactUrgency'),
        message: document.getElementById('contactMessage'),
        consent: document.getElementById('contactConsent'),
        submitButton: contactForm.querySelector('button[type="submit"]')
    };

    // ===== FORM VALIDATION =====
    class FormValidator {
        constructor(form, config) {
            this.form = form;
            this.config = config;
            this.errors = {};
        }

        // Validate individual field
        validateField(fieldName, value) {
            const errors = [];

            switch (fieldName) {
                case 'contactFirstName':
                case 'contactLastName':
                    if (!value || value.trim().length < 2) {
                        errors.push('Must be at least 2 characters long');
                    }
                    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                        errors.push('Only letters, spaces, hyphens, and apostrophes allowed');
                    }
                    break;

                case 'contactPhone':
                    const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
                    if (!this.config.phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
                        errors.push('Please enter a valid phone number (at least 10 digits)');
                    }
                    break;

                case 'contactEmail':
                    if (!this.config.emailRegex.test(value)) {
                        errors.push('Please enter a valid email address');
                    }
                    break;

                case 'contactMessage':
                    if (!value || value.trim().length < 10) {
                        errors.push('Message must be at least 10 characters long');
                    }
                    if (value.length > this.config.maxMessageLength) {
                        errors.push(`Message cannot exceed ${this.config.maxMessageLength} characters`);
                    }
                    break;
            }

            return errors;
        }

        // Validate entire form
        validateForm(formData) {
            this.errors = {};

            // Check required fields
            this.config.requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                const value = formData.get(fieldId) || field?.value || '';
                
                if (!value.trim()) {
                    this.errors[fieldId] = ['This field is required'];
                } else {
                    const fieldErrors = this.validateField(fieldId, value);
                    if (fieldErrors.length > 0) {
                        this.errors[fieldId] = fieldErrors;
                    }
                }
            });

            // Check consent
            if (!formData.get('contactConsent')) {
                this.errors['contactConsent'] = ['You must agree to receive communications'];
            }

            return Object.keys(this.errors).length === 0;
        }

        // Display validation errors
        displayErrors() {
            // Clear previous errors
            this.clearErrors();

            // Display new errors
            Object.keys(this.errors).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                const errors = this.errors[fieldId];
                
                if (field && errors.length > 0) {
                    this.showFieldError(field, errors[0]);
                }
            });
        }

        // Show error for specific field
        showFieldError(field, message) {
            field.classList.add('is-invalid');
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.invalid-feedback');
            if (existingError) {
                existingError.remove();
            }

            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }

        // Clear all errors
        clearErrors() {
            const invalidFields = this.form.querySelectorAll('.is-invalid');
            const errorMessages = this.form.querySelectorAll('.invalid-feedback');
            
            invalidFields.forEach(field => field.classList.remove('is-invalid'));
            errorMessages.forEach(message => message.remove());
        }

        // Clear error for specific field
        clearFieldError(field) {
            field.classList.remove('is-invalid');
            const errorMessage = field.parentNode.querySelector('.invalid-feedback');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    }

    // ===== FORM SUBMISSION HANDLER =====
    class ContactFormHandler {
        constructor(form, validator) {
            this.form = form;
            this.validator = validator;
            this.isSubmitting = false;
        }

        async handleSubmission(formData) {
            if (this.isSubmitting) return;

            try {
                this.isSubmitting = true;
                this.showLoadingState();

                // Validate form
                if (!this.validator.validateForm(formData)) {
                    this.validator.displayErrors();
                    this.showNotification('Please correct the errors below.', 'error');
                    return;
                }

                // Prepare submission data
                const submissionData = this.prepareSubmissionData(formData);

                // Submit form (simulate API call)
                const response = await this.submitToAPI(submissionData);

                if (response.success) {
                    this.handleSuccess();
                } else {
                    this.handleError(response.message || 'Submission failed');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                this.handleError('An unexpected error occurred. Please try again.');
            } finally {
                this.isSubmitting = false;
                this.hideLoadingState();
            }
        }

        prepareSubmissionData(formData) {
            const data = {
                firstName: formData.get('contactFirstName'),
                lastName: formData.get('contactLastName'),
                phone: formData.get('contactPhone'),
                email: formData.get('contactEmail'),
                address: formData.get('contactAddress'),
                service: formData.get('contactService'),
                urgency: formData.get('contactUrgency'),
                message: formData.get('contactMessage'),
                consent: formData.get('contactConsent') ? true : false,
                timestamp: new Date().toISOString(),
                source: 'contact_form',
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            // Add priority flag for emergency requests
            if (data.urgency === 'emergency') {
                data.priority = 'high';
                data.notifications = ['sms', 'email', 'phone'];
            }

            return data;
        }

        async submitToAPI(data) {
            // Simulate API call - replace with actual endpoint
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Simulate success (replace with actual API call)
                    console.log('Contact form data:', data);
                    
                    // Simulate different response scenarios
                    const scenarios = ['success', 'error'];
                    const scenario = Math.random() < 0.9 ? 'success' : 'error';
                    
                    if (scenario === 'success') {
                        resolve({
                            success: true,
                            message: 'Contact form submitted successfully',
                            ticketId: 'PEST-' + Date.now()
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Server error. Please try again later.'
                        });
                    }
                }, 2000);
            });

            /* 
            // Actual API implementation would look like this:
            
            try {
                const response = await fetch(CONFIG.emailEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error('API submission error:', error);
                return { success: false, message: 'Network error occurred' };
            }
            */
        }

        handleSuccess() {
            // Reset form
            this.form.reset();
            this.validator.clearErrors();

            // Show success notification
            this.showNotification(
                'Thank you for contacting us! We\'ll respond within 2 hours during business hours.',
                'success',
                7000
            );

            // Track conversion (analytics)
            this.trackConversion();

            // Scroll to top of form
            this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        handleError(message) {
            this.showNotification(message, 'error');
        }

        showLoadingState() {
            if (formElements.submitButton) {
                formElements.submitButton.disabled = true;
                formElements.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending Message...';
            }
        }

        hideLoadingState() {
            if (formElements.submitButton) {
                formElements.submitButton.disabled = false;
                formElements.submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
            }
        }

        showNotification(message, type, duration = 5000) {
            // Use the global notification system if available
            if (window.PestPro && window.PestPro.showNotification) {
                window.PestPro.showNotification(message, type, duration);
            } else {
                // Fallback notification
                alert(message);
            }
        }

        trackConversion() {
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'contact_form',
                    'value': 1
                });
            }

            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact');
            }
        }
    }

    // ===== REAL-TIME VALIDATION =====
    function initRealTimeValidation() {
        const validator = new FormValidator(contactForm, CONFIG);

        // Add blur validation for all form fields
        Object.keys(formElements).forEach(key => {
            const element = formElements[key];
            if (element && element.type !== 'submit') {
                element.addEventListener('blur', function() {
                    const fieldId = this.id;
                    const value = this.value;

                    if (CONFIG.requiredFields.includes(fieldId) && value.trim()) {
                        const errors = validator.validateField(fieldId, value);
                        if (errors.length > 0) {
                            validator.showFieldError(this, errors[0]);
                        } else {
                            validator.clearFieldError(this);
                        }
                    }
                });

                // Clear errors on focus
                element.addEventListener('focus', function() {
                    validator.clearFieldError(this);
                });
            }
        });
    }

    // ===== FORM ENHANCEMENTS =====
    function initFormEnhancements() {
        // Character counter for message field
        if (formElements.message) {
            const messageField = formElements.message;
            const counterDiv = document.createElement('div');
            counterDiv.className = 'form-text text-end';
            counterDiv.id = 'messageCounter';
            messageField.parentNode.appendChild(counterDiv);

            function updateCounter() {
                const length = messageField.value.length;
                const remaining = CONFIG.maxMessageLength - length;
                counterDiv.textContent = `${length}/${CONFIG.maxMessageLength} characters`;
                
                if (remaining < 50) {
                    counterDiv.classList.add('text-warning');
                } else {
                    counterDiv.classList.remove('text-warning');
                }
                
                if (remaining < 0) {
                    counterDiv.classList.add('text-danger');
                    counterDiv.classList.remove('text-warning');
                } else {
                    counterDiv.classList.remove('text-danger');
                }
            }

            messageField.addEventListener('input', updateCounter);
            updateCounter(); // Initialize counter
        }

        // Auto-resize textarea
        if (formElements.message) {
            formElements.message.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        }

        // Phone number formatting
        if (formElements.phone) {
            formElements.phone.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
                }
                
                e.target.value = value;
            });
        }

        // Service type change handler
        if (formElements.service) {
            formElements.service.addEventListener('change', function() {
                const value = this.value;
                
                // Auto-set urgency for emergency services
                if (value === 'emergency' && formElements.urgency) {
                    formElements.urgency.value = 'emergency';
                }
                
                // Pre-fill message based on service type
                if (formElements.message && !formElements.message.value.trim()) {
                    const serviceMessages = {
                        'general': 'I need general pest control services for my property.',
                        'termite': 'I\'m concerned about termite activity and need an inspection.',
                        'rodent': 'I have a rodent problem that needs professional attention.',
                        'commercial': 'I need pest control services for my business.',
                        'emergency': 'I have an urgent pest control situation that needs immediate attention.',
                        'inspection': 'I would like to schedule a comprehensive pest inspection.',
                    };
                    
                    if (serviceMessages[value]) {
                        formElements.message.value = serviceMessages[value];
                        // Trigger input event to update character counter
                        formElements.message.dispatchEvent(new Event('input'));
                    }
                }
            });
        }
    }

    // ===== AUTO-SAVE FUNCTIONALITY =====
    function initAutoSave() {
        const STORAGE_KEY = 'pestpro_contact_form_draft';
        
        // Load saved draft
        function loadDraft() {
            const draft = StorageUtils.get(STORAGE_KEY);
            if (draft) {
                Object.keys(draft).forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field && field.type !== 'submit') {
                        if (field.type === 'checkbox') {
                            field.checked = draft[fieldId];
                        } else {
                            field.value = draft[fieldId];
                        }
                    }
                });
                
                console.log('Loaded contact form draft');
            }
        }

        // Save draft
        function saveDraft() {
            const formData = new FormData(contactForm);
            const draft = {};
            
            for (const [key, value] of formData.entries()) {
                draft[key] = value;
            }
            
            StorageUtils.set(STORAGE_KEY, draft);
        }

        // Clear draft
        function clearDraft() {
            StorageUtils.remove(STORAGE_KEY);
        }

        // Auto-save on input
        const debouncedSave = debounce(saveDraft, 1000);
        contactForm.addEventListener('input', debouncedSave);

        // Clear draft on successful submission
        contactForm.addEventListener('submit', function() {
            setTimeout(clearDraft, 5000); // Clear after successful submission
        });

        // Load draft on page load
        loadDraft();
    }

    // ===== SPAM PROTECTION =====
    function initSpamProtection() {
        // Add honeypot field
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        contactForm.appendChild(honeypot);

        // Time-based protection
        const startTime = Date.now();
        
        contactForm.addEventListener('submit', function(e) {
            // Check honeypot
            if (honeypot.value) {
                e.preventDefault();
                console.log('Spam detected: honeypot filled');
                return false;
            }
            
            // Check submission time (too fast = likely bot)
            const submissionTime = Date.now() - startTime;
            if (submissionTime < 3000) {
                e.preventDefault();
                this.showNotification('Please take your time filling out the form.', 'warning');
                return false;
            }
        });
    }

    // ===== INITIALIZATION =====
    function init() {
        try {
            // Create validator and form handler
            const validator = new FormValidator(contactForm, CONFIG);
            const formHandler = new ContactFormHandler(contactForm, validator);

            // Set up form submission
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                formHandler.handleSubmission(formData);
            });

            // Initialize enhancements
            initRealTimeValidation();
            initFormEnhancements();
            initAutoSave();
            initSpamProtection();

            console.log('Contact form initialized successfully');

        } catch (error) {
            console.error('Contact form initialization error:', error);
        }
    }

    // Initialize the contact form
    init();
});

// ===== UTILITY FUNCTIONS =====
// (Include debounce and StorageUtils if not already available in main.js)

if (typeof debounce === 'undefined') {
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
}

if (typeof StorageUtils === 'undefined') {
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
            }
        },
        
        get: function(key) {
            if (this.isSupported()) {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            }
            return null;
        },
        
        remove: function(key) {
            if (this.isSupported()) {
                localStorage.removeItem(key);
            }
        }
    };
}
