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

  const payment =  async (req, res) => {
    const { paymentMethodId, amount } = req.body;
  
    try {
      // Create a payment intent with a return_url
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount*100, // Amount in cents (adjust as needed)
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true, // Confirm the payment immediately
        return_url: 'https://nameburg.com/', // Replace with your actual success URL
      });
  
      // Handle successful payment intent confirmation
      // You can save the paymentIntent.id in your database for future reference
  
      // Return the client secret and redirect to the return_url
      res.json({ success: true, client_secret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ success: false, message: 'Payment failed' });
    }
  }
  

module.exports = {
    stripeCheckout,
    payment
  };
  