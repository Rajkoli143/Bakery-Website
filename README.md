# Bakery Website

A modern, responsive bakery website with e-commerce functionality, built with HTML, CSS, and JavaScript.

## Features

- 🛍️ **E-commerce Functionality**
  - Product catalog
  - Shopping cart
  - Secure payment processing
  - Order tracking

- 💳 **Multiple Payment Options**
  - Credit/Debit Card payments
  - Razorpay integration
  - UPI payments
  - Netbanking

- 📱 **Responsive Design**
  - Mobile-friendly interface
  - Cross-browser compatibility
  - Modern UI/UX

- 🔍 **Search Functionality**
  - Global search across products
  - Quick product lookup

- 🛒 **Shopping Features**
  - Wishlist functionality
  - Cart management
  - Product categories

## Pages

1. **Home** (`index.html`)
   - Hero section with featured products
   - Daily bake showcase
   - Quick access to shop

2. **Shop** (`shop.html`)
   - Product catalog
   - Category filtering
   - Product details

3. **Cart** (`cart.html`)
   - Cart management
   - Quantity adjustment
   - Price calculation

4. **Payment** (`payment.html`)
   - Multiple payment methods
   - Secure checkout
   - Order confirmation

5. **Blog** (`blog.html`)
   - Baking tips
   - Recipes
   - News and updates

6. **About** (`about.html`)
   - Company information
   - Team members
   - Mission statement

7. **Contact** (`contact.html`)
   - Contact form
   - Location information
   - Business hours

8. **Recipe** (`recipe.html`)
   - Baking recipes
   - Step-by-step instructions
   - Ingredient lists

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bakery-website.git
   cd bakery-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:
   ```
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=3000
   ```

4. **Start the server**
   ```bash
   node server/index.js
   ```

5. **Access the website**
   Open `http://localhost:3000` in your browser

## Payment Integration

The website uses Razorpay for payment processing. To enable payments:

1. Sign up for a Razorpay account
2. Get your API keys from the Razorpay dashboard
3. Add the keys to your `.env` file
4. Test payments using Razorpay's test credentials

## File Structure

```
bakery-website/
├── images/              # Website images and icons
├── js/                  # JavaScript files
│   ├── payment.js       # Payment processing
│   └── global-search.js # Search functionality
├── server/              # Backend server
│   └── index.js         # Server configuration
├── style.css           # Main stylesheet
├── index.html          # Home page
├── shop.html           # Shop page
├── cart.html           # Cart page
├── payment.html        # Payment page
├── blog.html           # Blog page
├── about.html          # About page
├── contact.html        # Contact page
├── recipe.html         # Recipe page
├── .env                # Environment variables
└── README.md           # Documentation
```

## Technologies Used

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Razorpay Checkout SDK

- **Backend**
  - Node.js
  - Express.js
  - Razorpay API

## Security Features

- Secure payment processing
- Environment variable protection
- Input validation
- Error handling
- HTTPS support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@bakery.com or open an issue in the repository.

## Acknowledgments

- Razorpay for payment processing
- All contributors who have helped with the project 