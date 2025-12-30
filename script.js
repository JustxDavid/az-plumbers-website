/**
 * A-Z Plumbers - Main JavaScript
 * Handles mobile navigation, form validation, and user interactions
 */

(function() {
    'use strict';

    // --------------------------------------------------------------------------
    // Mobile Navigation Toggle
    // --------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            // Toggle active class on both button and nav
            this.classList.toggle('active');
            nav.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = nav.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on a nav link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --------------------------------------------------------------------------
    // Contact Form Handling
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form fields
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const service = document.getElementById('service');
            const message = document.getElementById('message');

            // Clear previous error states
            clearErrors();

            // Validate form
            let isValid = true;

            // Name validation
            if (!name.value.trim()) {
                showError(name, 'Please enter your name');
                isValid = false;
            }

            // Phone validation
            if (!phone.value.trim()) {
                showError(phone, 'Please enter your phone number');
                isValid = false;
            } else if (!isValidPhone(phone.value)) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            }

            // Email validation (optional but must be valid if provided)
            if (email.value.trim() && !isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }

            // Service validation
            if (!service.value) {
                showError(service, 'Please select a service');
                isValid = false;
            }

            if (isValid) {
                // Simulate form submission
                submitForm({
                    name: name.value.trim(),
                    phone: phone.value.trim(),
                    email: email.value.trim(),
                    service: service.value,
                    message: message.value.trim()
                });
            }
        });
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone format (flexible for various formats)
     */
    function isValidPhone(phone) {
        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '');
        // Accept 10 or 11 digit phone numbers (with or without country code)
        return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    }

    /**
     * Show error message for a form field
     */
    function showError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#e53e3e';

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#e53e3e';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;

        // Insert after the field
        field.parentNode.appendChild(errorDiv);
    }

    /**
     * Clear all error states
     */
    function clearErrors() {
        // Remove error styling from fields
        const fields = contactForm.querySelectorAll('input, select, textarea');
        fields.forEach(function(field) {
            field.classList.remove('error');
            field.style.borderColor = '';
        });

        // Remove error messages
        const errors = contactForm.querySelectorAll('.field-error');
        errors.forEach(function(error) {
            error.remove();
        });

        // Remove form-level messages
        const formMessages = contactForm.querySelectorAll('.form-success, .form-error');
        formMessages.forEach(function(msg) {
            msg.remove();
        });
    }

    /**
     * Handle form submission
     */
    function submitForm(data) {
        // Get the submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Simulate API call (in production, replace with actual form submission)
        setTimeout(function() {
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.innerHTML = '<strong>Thank you!</strong> We\'ve received your request and will contact you shortly.';
            contactForm.insertBefore(successDiv, contactForm.firstChild);

            // Reset form
            contactForm.reset();

            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            // Scroll to success message
            successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Remove success message after 10 seconds
            setTimeout(function() {
                successDiv.remove();
            }, 10000);

            // Log form data (for development)
            console.log('Form submitted:', data);
        }, 1000);
    }

    // --------------------------------------------------------------------------
    // Smooth Scroll Enhancement
    // --------------------------------------------------------------------------
    // Handle anchor links with smooth scrolling and header offset
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                // Get header height for offset
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;

                // Calculate target position
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --------------------------------------------------------------------------
    // Header Scroll Effect
    // --------------------------------------------------------------------------
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;

            // Add shadow when scrolled
            if (currentScrollY > 10) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '';
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // Phone Number Formatting
    // --------------------------------------------------------------------------
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(event) {
            // Get only digits
            let digits = this.value.replace(/\D/g, '');

            // Limit to 10 digits (excluding country code)
            if (digits.length > 10) {
                digits = digits.substring(0, 10);
            }

            // Format as (XXX) XXX-XXXX
            if (digits.length >= 6) {
                this.value = '(' + digits.substring(0, 3) + ') ' + digits.substring(3, 6) + '-' + digits.substring(6);
            } else if (digits.length >= 3) {
                this.value = '(' + digits.substring(0, 3) + ') ' + digits.substring(3);
            } else if (digits.length > 0) {
                this.value = '(' + digits;
            }
        });
    }

    // --------------------------------------------------------------------------
    // Intersection Observer for Animations (Optional Enhancement)
    // --------------------------------------------------------------------------
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe service cards and testimonials for fade-in effect
        document.querySelectorAll('.service-card, .testimonial-card, .value-item').forEach(function(el) {
            observer.observe(el);
        });
    }

})();
