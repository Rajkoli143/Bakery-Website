import config from './config.js';

// Get cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Calculate total amount
function calculateTotal() {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Initialize Razorpay payment
async function initializePayment() {
    try {
        const amount = calculateTotal();
        
        // Create order on the server
        const orderResponse = await fetch(`${config.API_URL}/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                currency: config.CURRENCY
            })
        });

        if (!orderResponse.ok) {
            throw new Error('Failed to create order');
        }

        const orderData = await orderResponse.json();

        const options = {
            key: config.RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: config.COMPANY_NAME,
            description: config.DESCRIPTION,
            order_id: orderData.id,
            handler: async function(response) {
                try {
                    // Verify payment
                    const verifyResponse = await fetch(`${config.API_URL}/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        handlePaymentSuccess(response);
                    } else {
                        throw new Error('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Payment verification failed:', error);
                    alert('Payment verification failed. Please contact support.');
                }
            },
            prefill: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                contact: document.getElementById('phone').value
            },
            theme: {
                color: "#5a7d7c"
            }
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    } catch (error) {
        console.error('Payment initialization failed:', error);
        alert('Failed to initialize payment. Please try again.');
    }
}

// Handle successful payment
function handlePaymentSuccess(response) {
    // Save order details
    const orderDetails = {
        orderId: response.razorpay_payment_id,
        items: getCartItems(),
        total: calculateTotal(),
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cartItems');
    
    // Redirect to success page
    window.location.href = 'order-success.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            initializePayment();
        });
    }

    // Display cart total
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `₹${calculateTotal().toFixed(2)}`;
    }
});

// Payment method selection
const paymentMethods = document.querySelectorAll('.payment-method');
paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
    });
}); 