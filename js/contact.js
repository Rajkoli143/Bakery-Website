document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contactForm');
    const formGroups = document.querySelectorAll('.form-group');
    const submitBtn = document.querySelector('.submit-btn');

    // Add animation to form groups
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 200 * index);
    });

    // Add hover effect to submit button
    if (submitBtn) {
        submitBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.backgroundColor = '#e67e22';
        });

        submitBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '#d35400';
        });
    }

    // Form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Remove any existing error messages
            const existingErrors = document.querySelectorAll('.error-message');
            existingErrors.forEach(error => error.remove());

            // Validate form fields
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const message = this.querySelector('#message').value.trim();

            let isValid = true;
            let errorMessage = '';

            if (!name) {
                errorMessage = 'Please enter your name';
                isValid = false;
            } else if (!email) {
                errorMessage = 'Please enter your email';
                isValid = false;
            } else if (!isValidEmail(email)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            } else if (!message) {
                errorMessage = 'Please enter your message';
                isValid = false;
            }

            if (!isValid) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = errorMessage;
                this.insertBefore(errorDiv, this.firstChild);
                return false;
            }

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://formspree.io/f/mjkwkwoz', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                });

                if (response.ok) {
                    // Show success message
                    showMessage('Message sent successfully!', 'success');
                    // Reset form
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                showMessage('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show message function
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.padding = '15px 25px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.color = 'white';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.animation = 'slideIn 0.5s ease forwards';
        
        // Set background color based on message type
        messageDiv.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        
        document.body.appendChild(messageDiv);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 500);
        }, 3000);
    }
}); 