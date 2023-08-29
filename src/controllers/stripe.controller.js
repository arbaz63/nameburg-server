const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeCheckout = async (req, res) => {
    const { items } = req.body; // Items array with product details
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map(item => ({
          price_data: {
            currency: 'usd', // Change to your desired currency
            product_data: {
              name: item.name, // Product name
              images: [item.image], // Array of product image URLs
            },
            unit_amount: item.price * 100, // Convert price to cents
          },
          quantity: item.quantity, // Quantity of the product
        })),
        mode: 'payment',
        success_url: 'https://jugtain.netlify.app/',
        cancel_url: 'https://jugtain.netlify.app/',
      });
  
      res.json({ sessionURL: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

module.exports = {
    stripeCheckout
  };
  