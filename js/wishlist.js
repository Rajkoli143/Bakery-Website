document.addEventListener('DOMContentLoaded', function() {
    const wishlistItems = document.querySelector('.wishlist-items');
    const wishlistContainer = document.querySelector('.wishlist-container');
    const emptyWishlist = document.querySelector('.empty-wishlist');
    
    // Get wishlist items from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update wishlist display
    function updateWishlistDisplay() {
        if (wishlist.length === 0) {
            wishlistContainer.style.display = 'none';
            emptyWishlist.classList.add('visible');
            return;
        }

        wishlistContainer.style.display = 'block';
        emptyWishlist.classList.remove('visible');
        
        // Clear current wishlist items
        wishlistItems.innerHTML = '';
        
        // Add each item to the wishlist
        wishlist.forEach((item, index) => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item animate__animated animate__fadeIn';
            wishlistItem.style.animationDelay = `${index * 0.1}s`;
            
            wishlistItem.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-item-content">
                    <h3>${item.name}</h3>
                    <div class="wishlist-item-price">${item.price}</div>
                    <div class="wishlist-item-actions">
                        <button class="add-to-cart-btn">Add to Cart</button>
                        <button class="remove-from-wishlist">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            wishlistItems.appendChild(wishlistItem);
            
            // Add event listeners
            const addToCartBtn = wishlistItem.querySelector('.add-to-cart-btn');
            const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
            
            addToCartBtn.addEventListener('click', () => {
                // Add to cart
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push(item);
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Show success message
                showMessage(`${item.name} added to cart!`, 'success');
            });
            
            removeBtn.addEventListener('click', () => {
                wishlistItem.classList.add('animate__fadeOut');
                setTimeout(() => {
                    wishlist.splice(index, 1);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    updateWishlistDisplay();
                }, 500);
            });
        });
    }
    
    // Show message function
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '5px',
            color: 'white',
            backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c',
            zIndex: '1000',
            animation: 'slideIn 0.5s ease forwards'
        });
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 500);
        }, 3000);
    }
    
    // Initialize wishlist display
    updateWishlistDisplay();
}); 