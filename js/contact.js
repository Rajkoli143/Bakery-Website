document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    const formGroups = document.querySelectorAll('.form-group');
    const submitBtn = document.querySelector('.submit-btn');

    // Add animation classes to form elements
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 200 * index);
    });

    // Form submission handling
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const formData = {
            name: this.querySelector('input[name="name"]').value,
            email: this.querySelector('input[name="email"]').value,
            subject: this.querySelector('input[name="subject"]').value,
            message: this.querySelector('textarea[name="message"]').value
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Show success message
            showMessage('Message sent successfully!', 'success');
            
            // Reset button
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }, 1500);
    });

    // Form validation
    function validateForm(data) {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name.trim()) {
            showMessage('Please enter your name', 'error');
            isValid = false;
        }

        if (!data.email.trim() || !emailRegex.test(data.email)) {
            showMessage('Please enter a valid email address', 'error');
            isValid = false;
        }

        if (!data.subject.trim()) {
            showMessage('Please enter a subject', 'error');
            isValid = false;
        }

        if (!data.message.trim()) {
            showMessage('Please enter your message', 'error');
            isValid = false;
        }

        return isValid;
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