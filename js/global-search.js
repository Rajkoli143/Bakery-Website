document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const closeSearch = document.querySelector('.close-search');
    const searchResults = document.querySelector('.search-results');
    let searchTimeout;

    // Product data - this should match the products in shop.html
    const products = [
        { name: 'Pumpernickel', price: '$3.0', category: 'bread', image: 'images/pumpernickel.webp' },
        { name: 'Pretzel', price: '$7.2', category: 'bread', image: 'images/pretzels.webp' },
        { name: 'Croissant', price: '$3.5', category: 'pastries', image: 'images/Croissant.webp' },
        { name: 'Danish', price: '$4.5', category: 'pastries', image: 'images/Danish.webp' },
        { name: 'Chocolate Cake', price: '$20.0', category: 'cakes', image: 'images/Chocolate Cake.webp' },
        { name: 'Cheesecake', price: '$18.0', category: 'cakes', image: 'images/Cheesecake.jpg' }
    ];

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

    // Handle search input
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim().toLowerCase();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
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

    // Add Enter key press handler
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim().toLowerCase();
            if (query.length > 0) {
                const results = performSearch(query);
                if (results.length > 0) {
                    // Store search query in localStorage
                    localStorage.setItem('lastSearchQuery', query);
                    // Navigate to shop page
                    window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
                } else {
                    // Show no results message
                    searchResults.innerHTML = `
                        <div class="search-result-item">
                            <p>No products found</p>
                        </div>
                    `;
                }
                closeSearchOverlay();
            }
        }
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
                // Store search query in localStorage
                localStorage.setItem('lastSearchQuery', productName.toLowerCase());
                // Navigate to shop page
                window.location.href = `shop.html?search=${encodeURIComponent(productName)}`;
                closeSearchOverlay();
            });
        });
    }

    function performSearch(query) {
        return products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
}); 