document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons and recipe cards
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter recipe cards
            filterRecipes(filterValue);
        });
    });
    
    // Function to filter recipes
    function filterRecipes(filter) {
        recipeCards.forEach(card => {
            // Reset animation
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            
            if (filter === 'all') {
                // Show all cards with animation
                card.style.display = 'block';
                card.style.animation = 'animate__fadeInUp 0.5s ease forwards';
            } else {
                // Check if card matches the filter
                if (card.getAttribute('data-category') === filter) {
                    // Show matching cards with animation
                    card.style.display = 'block';
                    card.style.animation = 'animate__fadeInUp 0.5s ease forwards';
                } else {
                    // Hide non-matching cards
                    card.style.display = 'none';
                }
            }
        });
    }
    
    // Add hover effect to recipe cards
    recipeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Add click event to view recipe buttons
    const viewRecipeButtons = document.querySelectorAll('.view-recipe-btn');
    viewRecipeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the recipe title
            const recipeTitle = this.closest('.recipe-content').querySelector('h2').textContent;
            
            // Show a message (in a real application, this would navigate to a recipe detail page)
            showMessage(`Recipe details for "${recipeTitle}" will be available soon!`, 'info');
        });
    });
    
    // Function to show messages
    function showMessage(message, type) {
        // Create message element
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
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#4CAF50';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#f44336';
        } else if (type === 'info') {
            messageDiv.style.backgroundColor = '#2196F3';
        }
        
        // Add message to the DOM
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