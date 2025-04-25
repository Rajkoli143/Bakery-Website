document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('payment-form');
    const submitButton = document.getElementById('submit-button');
    const paymentMessage = document.getElementById('payment-message');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardDetails = document.getElementById('card-details');
    let selectedPaymentMethod = 'razorpay';

    // Handle payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            selectedPaymentMethod = method.dataset.method;
            
            // Show/hide card details based on selection
            if (selectedPaymentMethod === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
        
        try {
            // Get cart total from localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const total = cart.reduce((sum, item) => {
                const price = parseFloat(item.price.replace('$', ''));
                return sum + (price * (item.quantity || 1));
            }, 0) + 5; // Add shipping cost

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;

            if (selectedPaymentMethod === 'card') {
                // Handle card payment
                const cardNumber = document.getElementById('card-number').value;
                const cardExpiry = document.getElementById('card-expiry').value;
                const cardCvv = document.getElementById('card-cvv').value;
                const cardName = document.getElementById('card-name').value;

                // Basic card validation
                if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                    throw new Error('Please fill in all card details');
                }

                // Process card payment
                const response = await fetch('http://localhost:3000/process-card-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: Math.round(total * 100), // Convert to paise
                        currency: 'INR',
                        cardNumber,
                        cardExpiry,
                        cardCvv,
                        cardName,
                        name,
                        email,
                        phone,
                        address
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    paymentMessage.textContent = 'Payment successful! Thank you for your order.';
                    paymentMessage.className = 'payment-message success';
                    localStorage.removeItem('cart');
                    setTimeout(() => {
                        window.location.href = 'order-success.html';
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Card payment failed');
                }
            } else {
                // Handle Razorpay payment
                const response = await fetch('http://localhost:3000/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: Math.round(total * 100), // Convert to paise
                        currency: 'INR',
                        name,
                        email,
                        phone,
                        address,
                        payment_method: selectedPaymentMethod
                    }),
                });

                const order = await response.json();

                if (order.error) {
                    throw new Error(order.error);
                }

                // Get Razorpay key from server
                const keyResponse = await fetch('http://localhost:3000/get-razorpay-key');
                const { key } = await keyResponse.json();

                // Initialize Razorpay
                const options = {
                    key: key,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Bakery',
                    description: 'Order Payment',
                    order_id: order.id,
                    handler: async function(response) {
                        try {
                            const verifyResponse = await fetch('http://localhost:3000/verify-payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    order_id: response.razorpay_order_id,
                                    payment_id: response.razorpay_payment_id,
                                    signature: response.razorpay_signature
                                }),
                            });

                            const verifyResult = await verifyResponse.json();

                            if (verifyResult.success) {
                                paymentMessage.textContent = 'Payment successful! Thank you for your order.';
                                paymentMessage.className = 'payment-message success';
                                localStorage.removeItem('cart');
                                setTimeout(() => {
                                    window.location.href = 'order-success.html';
                                }, 2000);
                            } else {
                                throw new Error('Payment verification failed');
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            paymentMessage.textContent = 'Payment verification failed. Please contact support.';
                            paymentMessage.className = 'payment-message error';
                            submitButton.disabled = false;
                            submitButton.textContent = 'Pay Now';
                        }
                    },
                    prefill: {
                        name: name,
                        email: email,
                        contact: phone
                    },
                    theme: {
                        color: '#5a7d7c'
                    }
                };

                if (selectedPaymentMethod === 'upi') {
                    options.method = { upi: true };
                } else if (selectedPaymentMethod === 'netbanking') {
                    options.method = { netbanking: true };
                }

                const rzp = new Razorpay(options);
                rzp.open();
            }
        } catch (error) {
            console.error('Error:', error);
            paymentMessage.textContent = error.message || 'An error occurred. Please try again.';
            paymentMessage.className = 'payment-message error';
            submitButton.disabled = false;
            submitButton.textContent = 'Pay Now';
        }
    });
}); 