document.addEventListener('DOMContentLoaded', function() {
    // Get the bakery interior image
    const bakeryImage = document.querySelector('.bakery-interior-img');
    
    if (bakeryImage) {
        // Add hover effect to the image
        bakeryImage.addEventListener('mouseenter', function() {
            // Remove any existing animation classes
            this.classList.remove('animate__zoomIn', 'animate__pulse');
            
            // Add a pulse animation on hover
            this.classList.add('animate__animated', 'animate__pulse');
            
            // Add a subtle zoom effect with CSS transform
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.5s ease';
        });
        
        bakeryImage.addEventListener('mouseleave', function() {
            // Remove animation classes
            this.classList.remove('animate__animated', 'animate__pulse');
            
            // Reset transform
            this.style.transform = 'scale(1)';
        });
        
        // Add click event to show a larger version of the image
        bakeryImage.addEventListener('click', function() {
            // Create a modal overlay
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            
            // Create the modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content animate__animated animate__zoomIn';
            
            // Create the close button
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-modal';
            closeBtn.innerHTML = '&times;';
            
            // Create the enlarged image
            const enlargedImage = document.createElement('img');
            enlargedImage.src = this.src;
            enlargedImage.alt = this.alt;
            
            // Assemble the modal
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(enlargedImage);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
            
            // Close modal when clicking the close button
            closeBtn.addEventListener('click', function() {
                modalContent.classList.remove('animate__zoomIn');
                modalContent.classList.add('animate__zoomOut');
                
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = 'auto';
                }, 500);
            });
            
            // Close modal when clicking outside the image
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modalContent.classList.remove('animate__zoomIn');
                    modalContent.classList.add('animate__zoomOut');
                    
                    setTimeout(() => {
                        document.body.removeChild(modal);
                        document.body.style.overflow = 'auto';
                    }, 500);
                }
            });
        });
    }
    
    // Add CSS for the modal
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .modal-content img {
            max-width: 100%;
            max-height: 80vh;
            display: block;
        }
        
        .close-modal {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 30px;
            font-weight: bold;
            color: #5a7d7c;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .close-modal:hover {
            color: #e74c3c;
        }
    `;
    document.head.appendChild(style);
}); 


