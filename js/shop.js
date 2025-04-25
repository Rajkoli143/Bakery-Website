document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const productGrid = document.querySelector('.product-grid');

    // Add wishlist button to each product
    productItems.forEach(item => {
        const productImage = item.querySelector('.product-image');
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        productImage.appendChild(wishlistBtn);

        // Check if item is in wishlist
        const productName = item.querySelector('h3').textContent;
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (wishlist.some(item => item.name === productName)) {
            wishlistBtn.classList.add('active');
        }
    });

    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-filter');
            
            // Hide all products first
            productItems.forEach(item => {
                item.style.display = 'none';
                item.classList.remove('animate__fadeInUp');
            });

            // Show products of selected category with animation
            if (category === 'all') {
                productItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.classList.add('animate__fadeInUp');
                    }, index * 100);
                });
            } else {
                productItems.forEach((item, index) => {
                    if (item.getAttribute('data-category') === category) {
                        setTimeout(() => {
                            item.style.display = 'block';
                            item.classList.add('animate__fadeInUp');
                        }, index * 100);
                    }
                });
            }
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            if (!productItem) {
                console.error('Product item not found');
                return;
            }

            const productName = productItem.querySelector('h3')?.textContent;
            const productPrice = productItem.querySelector('.product-price')?.textContent;
            const productImage = productItem.querySelector('img')?.src;

            if (!productName || !productPrice || !productImage) {
                console.error('Required product information not found');
                return;
            }

            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };

            // Check if product already exists in cart
            const existingProductIndex = cart.findIndex(item => item.name === productName);
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            // Show success message with animation
            showMessage(`${productName} added to cart!`, 'success');
            
            // Add a pulse animation to the button
            button.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                button.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        });
    });

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Initialize wishlist buttons state
    wishlistButtons.forEach(button => {
        const productItem = button.closest('.product-item');
        const productName = productItem.querySelector('h3').textContent;
        
        if (wishlist.some(item => item.name === productName)) {
            button.classList.add('active');
        }
    });

    wishlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            const productName = productItem.querySelector('h3').textContent;
            const productPrice = productItem.querySelector('.product-price').textContent;
            const productImage = productItem.querySelector('img').src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImage
            };

            const index = wishlist.findIndex(item => item.name === productName);

            if (index === -1) {
                // Add to wishlist
                wishlist.push(product);
                button.classList.add('active');
                showMessage(`${productName} added to wishlist!`, 'success');
            } else {
                // Remove from wishlist
                wishlist.splice(index, 1);
                button.classList.remove('active');
                showMessage(`${productName} removed from wishlist!`, 'info');
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
        });
    });

    // Update wishlist count
    function updateWishlistCount() {
        const wishlistIcon = document.querySelector('a[href="wishlist.html"]');
        let wishlistCount = wishlistIcon.querySelector('.wishlist-count');
        
        if (!wishlistCount) {
            wishlistCount = document.createElement('span');
            wishlistCount.className = 'wishlist-count';
            wishlistIcon.appendChild(wishlistCount);
        }

        const count = wishlist.length;
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'flex' : 'none';
    }

    // Initialize wishlist count
    updateWishlistCount();
    
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
            backgroundColor: type === 'success' ? '#2ecc71' : '#e67e22',
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

    // Search functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const closeSearch = document.querySelector('.close-search');
    const searchResults = document.querySelector('.search-results');
    let searchTimeout;

    // Open search overlay
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.add('active');
        searchInput.focus();
        document.body.style.overflow = 'hidden';
    });

    // Close search overlay
    closeSearch.addEventListener('click', function() {
        closeSearchOverlay();
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        }
    });

    // Close if clicked outside search container
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            closeSearchOverlay();
        }
    });

    function closeSearchOverlay() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
        document.body.style.overflow = '';
    }

    // Handle search from URL or localStorage
    function handleSearch() {
        // Get search query from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        // If no URL parameter, check localStorage
        const lastSearchQuery = searchQuery || localStorage.getItem('lastSearchQuery');
        
        if (lastSearchQuery) {
            // Clear any existing search
            searchInput.value = '';
            searchResults.innerHTML = '';
            
            // Filter products based on search query
            const query = lastSearchQuery.toLowerCase();
            productItems.forEach(item => {
                const productName = item.querySelector('h3').textContent.toLowerCase();
                const productCategory = item.getAttribute('data-category').toLowerCase();
                
                if (productName.includes(query) || productCategory.includes(query)) {
                    item.style.display = 'block';
                    item.classList.add('animate__fadeInUp');
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Clear the search from localStorage
            localStorage.removeItem('lastSearchQuery');
        }
    }

    // Call handleSearch when the page loads
    handleSearch();

    // Handle search input
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim().toLowerCase();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            // Show all products when search is cleared
            productItems.forEach(item => {
                item.style.display = 'block';
                item.classList.add('animate__fadeInUp');
            });
            return;
        }

        // Show loading state
        searchResults.innerHTML = '<div class="search-loading">Searching...</div>';
        searchResults.classList.add('active');

        // Debounce search
        searchTimeout = setTimeout(() => {
            showSearchSuggestions(query);
        }, 300);
    });

    function showSearchSuggestions(query) {
        const results = performSearch(query);

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-result-item">
                    <p>No products found</p>
                </div>
            `;
            return;
        }

        const suggestionsHTML = results.map(product => `
            <div class="search-result-item">
                <div class="search-result-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="search-result-details">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = suggestionsHTML;

        // Add click handlers to suggestions
        document.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const productName = results[index].name;
                // Filter products to show only the selected one
                productItems.forEach(item => {
                    const itemName = item.querySelector('h3').textContent;
                    if (itemName === productName) {
                        item.style.display = 'block';
                        item.classList.add('animate__fadeInUp');
                        // Scroll to the product
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        item.style.display = 'none';
                    }
                });
                closeSearchOverlay();
            });
        });
    }

    function performSearch(query) {
        return Array.from(productItems)
            .map(item => ({
                name: item.querySelector('h3').textContent,
                price: item.querySelector('.product-price').textContent,
                image: item.querySelector('img').src,
                category: item.getAttribute('data-category')
            }))
            .filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
    }

    // Add styles for search suggestions, no results message, and product highlighting
    const style = document.createElement('style');
    style.textContent = `
        .no-results-message {
            text-align: center;
            padding: 2rem;
            grid-column: 1 / -1;
        }
        .no-results-message p {
            color: #666;
            margin-bottom: 1rem;
        }
        .clear-search {
            background-color: #5a7d7c;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .clear-search:hover {
            background-color: #4a6d6c;
        }
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
        }
        .suggestion-item {
            padding: 12px 20px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .suggestion-item:hover {
            background-color: #f5f5f5;
        }
        .suggestion-item .product-name {
            font-weight: 600;
            color: #333;
        }
        .suggestion-item .product-price {
            color: #e67e22;
            font-weight: 500;
        }
        .suggestion-item .product-category {
            font-size: 0.9em;
            color: #666;
        }
        @keyframes highlight-product {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(230, 126, 34, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0); }
        }
        .highlight-product {
            animation: highlight-product 2s ease;
        }
    `;
    document.head.appendChild(style);

    // Handle product highlighting from search redirect
    function handleSearchRedirect() {
        const hash = window.location.hash;
        if (hash) {
            const productName = hash.substring(1).replace(/-/g, ' ');
            const productItems = document.querySelectorAll('.product-item');
            
            productItems.forEach(item => {
                const itemName = item.querySelector('h3').textContent.toLowerCase();
                if (itemName === productName) {
                    // Hide all products first
                    productItems.forEach(p => {
                        p.style.display = 'none';
                        p.classList.remove('animate__fadeInUp');
                    });
                    
                    // Show and highlight the searched product
                    item.style.display = 'block';
                    item.classList.add('animate__fadeInUp', 'highlight-product');
                    
                    // Scroll to the product
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Remove highlight after animation
                    setTimeout(() => {
                        item.classList.remove('highlight-product');
                    }, 2000);
                }
            });
        }
    }

    // Call the function when the page loads
    handleSearchRedirect();
});
