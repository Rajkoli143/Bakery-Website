const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'https://rajkoli143.github.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

let razorpay;
try {
    // Initialize Razorpay
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.warn('Warning: Razorpay credentials not found in environment variables');
    } else {
        const Razorpay = require('razorpay');
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
} catch (error) {
    console.error('Error initializing Razorpay:', error);
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        razorpayInitialized: !!razorpay
    });
});

// Get Razorpay key endpoint
app.get('/get-razorpay-key', (req, res) => {
    if (!process.env.RAZORPAY_KEY_ID) {
        return res.status(500).json({ error: 'Razorpay not configured' });
    }
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Create order endpoint
app.post('/create-order', async (req, res) => {
    if (!razorpay) {
        return res.status(500).json({ error: 'Payment service not configured' });
    }

    try {
        const { amount, currency } = req.body;
        
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
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
    if (!razorpay) {
        return res.status(500).json({ error: 'Payment service not configured' });
    }

    try {
        const { order_id, payment_id, signature } = req.body;
        
        if (!order_id || !payment_id || !signature) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required parameters' 
            });
        }

        const crypto = require('crypto');
        const body = order_id + "|" + payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === signature;
        
        res.json({ 
            success: isValid, 
            message: isValid ? 'Payment verified successfully' : 'Invalid payment signature'
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Razorpay initialized: ${!!razorpay}`);
}); 