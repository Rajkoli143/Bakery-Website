const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Get Razorpay key endpoint
app.get('/get-razorpay-key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Create order endpoint
app.post('/create-order', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        
        const options = {
            amount: amount * 100, // Convert to paise
            currency: currency || 'INR',
            receipt: `order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Process card payment endpoint
app.post('/process-card-payment', async (req, res) => {
    try {
        const { 
            amount, 
            currency, 
            cardNumber, 
            cardExpiry, 
            cardCvv, 
            cardName,
            name,
            email,
            phone,
            address
        } = req.body;

        // Basic card validation
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing card details' 
            });
        }

        // Create a Razorpay order for card payment
        const options = {
            amount: amount,
            currency: currency || 'INR',
            receipt: `card_order_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        // Process card payment using Razorpay's card payment API
        const payment = await razorpay.payments.create({
            amount: amount,
            currency: currency || 'INR',
            order_id: order.id,
            method: 'card',
            card: {
                number: cardNumber,
                name: cardName,
                expiry_month: cardExpiry.split('/')[0],
                expiry_year: cardExpiry.split('/')[1],
                cvv: cardCvv
            },
            notes: {
                name,
                email,
                phone,
                address
            }
        });

        if (payment.status === 'captured') {
            res.json({ 
                success: true, 
                message: 'Payment successful',
                payment_id: payment.id
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'Payment failed' 
            });
        }
    } catch (error) {
        console.error('Error processing card payment:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to process card payment' 
        });
    }
});

// Verify payment endpoint
app.post('/verify-payment', async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;
        
        const crypto = require('crypto');
        const body = order_id + "|" + payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === signature) {
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 