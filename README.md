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

## Live Demo

- Frontend: [https://rajkoli143.github.io/Bakery-Website-new/](https://rajkoli143.github.io/Bakery-Website-new/)
- Backend: [Your Render URL]

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

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rajkoli143/Bakery-Website.git
   cd Bakery-Website
   ```

2. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the server directory with:
   ```
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5500
   ```

4. **Start the server**
   ```bash
   node index.js
   ```

5. **Access the website**
   Open `index.html` in your browser or use a local server

### Deployment

#### Backend Deployment (Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`
4. Add Environment Variables:
   - `PORT`: 3000
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay secret key
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: Your frontend URL

#### Frontend Deployment (GitHub Pages)

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Your site will be available at 'https://rajkoli143.github.io/Bakery-Website-new/'

## Payment Integration

The website uses Razorpay for payment processing. To enable payments:

1. Sign up for a Razorpay account
2. Get your API keys from the Razorpay dashboard
3. Add the keys to your environment variables
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

## Important Notes

- The backend server on Render's free tier will sleep after 15 minutes of inactivity
- First request after inactivity may take 30-50 seconds to respond
- For production use, consider upgrading to a paid tier for consistent performance

## Support

For support, please open an issue in the repository.

## Acknowledgments

- Razorpay for payment processing
- Render.com for backend hosting
- GitHub Pages for frontend hosting
- All contributors who have helped with the project 