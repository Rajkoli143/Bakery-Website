document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.querySelector('.cart-items');
    const cartContainer = document.querySelector('.cart-container');
    const emptyCart = document.querySelector('.empty-cart');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-amount');
    const shippingElement = document.querySelector('.shipping');
    
    // Get cart items from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartContainer.style.display = 'none';
            emptyCart.classList.add('visible');
            return;
        }

        cartContainer.style.display = 'grid';
        emptyCart.classList.remove('visible');
        
        // Clear current cart items
        cartItems.innerHTML = '';
        
        // Add each item to the cart
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item animate__animated animate__fadeIn';
            cartItem.style.animationDelay = `${index * 0.1}s`;
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">${item.quantity || 1}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="cart-item-price">
                    ${item.price}
                </div>
                <button class="remove-item">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            cartItems.appendChild(cartItem);
            
            // Add event listeners for quantity buttons
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const quantitySpan = cartItem.querySelector('.quantity');
            const removeBtn = cartItem.querySelector('.remove-item');
            
            minusBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    quantitySpan.textContent = item.quantity;
                    updateCart();
                }
            });
            
            plusBtn.addEventListener('click', () => {
                item.quantity = (item.quantity || 1) + 1;
                quantitySpan.textContent = item.quantity;
                updateCart();
            });
            
            removeBtn.addEventListener('click', () => {
                cartItem.classList.add('animate__fadeOut');
                setTimeout(() => {
                    cart.splice(index, 1);
                    updateCart();
                    updateCartDisplay();
                }, 500);
            });
        });
        
        updateTotals();
    }
    
    // Update cart in localStorage
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateTotals();
    }
    
    // Update totals
    function updateTotals() {
        const subtotal = cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + price * (item.quantity || 1);
        }, 0);
        
        const shipping = subtotal > 0 ? 5 : 0;
        const total = subtotal + shipping;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Initialize cart display
    updateCartDisplay();
    
    // Checkout button functionality
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            // Redirect to payment page
            window.location.href = 'payment.html';
        }
    });
}); 