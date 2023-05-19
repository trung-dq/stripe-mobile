import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(
  'sk_test_51N7sfhIQlvjPuhNbmZLW5LZR6icXDJuVTCECKMWIicCngI1TN9dih0NT3B8gsMPmJ7ONcxuL6UxXsAAdfJaNkRrV00xHK7o8Jd',
  {
    apiVersion: '2022-11-15',
    typescript: true,
  },
);
const app = express();
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000,
    currency: 'usd',
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(6000, () => console.log('Server up'));
