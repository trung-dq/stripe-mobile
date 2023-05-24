import express from 'express';
import Stripe from 'stripe';
require('dotenv').config();

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const itemIdToPrice: {[id: string]: number} = {
  'id-1': 1400,
  'id-2': 2000,
  'id-3': 3000,
  'id-4': 4000,
  // 'id-5': 5000,
};

const calculateOrderAmount = (itemIds: string[] = ['id-1']): number => {
  const total = itemIds
    .map(id => itemIdToPrice[id])
    .reduce((prev, curr) => prev + curr, 0);

  return total;
};
function getKeys(payment_method?: string) {
  let secret_key: string | undefined = stripeSecretKey;
  let publishable_key: string | undefined = stripePublishableKey;

  switch (payment_method) {
    case 'grabpay':
    case 'fpx':
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_MY;
      secret_key = process.env.STRIPE_SECRET_KEY_MY;
      break;
    case 'au_becs_debit':
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_AU;
      secret_key = process.env.STRIPE_SECRET_KEY_AU;
      break;
    case 'oxxo':
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_MX;
      secret_key = process.env.STRIPE_SECRET_KEY_MX;
      break;
    case 'wechat_pay':
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_WECHAT;
      secret_key = process.env.STRIPE_SECRET_KEY_WECHAT;
      break;
    case 'paypal':
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_UK;
      secret_key = process.env.STRIPE_SECRET_KEY_UK;
      break;
    default:
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY;
      secret_key = process.env.STRIPE_SECRET_KEY;
  }

  return {secret_key, publishable_key};
}
const app = express();
app.use(express.json());

app.post(
  '/create-payment-intent',
  async (
    req: express.Request,
    res: express.Response,
  ): Promise<express.Response<any>> => {
    const {
      email,
      items,
      currency,
      request_three_d_secure,
      payment_method_types = [],
      client = 'ios',
    }: {
      email: string;
      items: string[];
      currency: string;
      payment_method_types: string[];
      request_three_d_secure: 'any' | 'automatic';
      client: 'ios' | 'android';
    } = req.body;

    const {secret_key} = getKeys(payment_method_types[0]);

    const stripe = new Stripe(secret_key as string, {
      apiVersion: '2022-11-15',
      typescript: true,
    });

    const customer = await stripe.customers.create({email});
    // Create a PaymentIntent with the order amount and currency.
    const params: Stripe.PaymentIntentCreateParams = {
      amount: calculateOrderAmount(items),
      currency,
      customer: customer.id,
      payment_method_options: {
        card: {
          request_three_d_secure: request_three_d_secure || 'automatic',
        },
        sofort: {
          preferred_language: 'en',
        },
        wechat_pay: {
          app_id: 'wx65907d6307c3827d',
          client: client,
        },
      },
      payment_method_types: payment_method_types,
    };

    try {
      const paymentIntent: Stripe.PaymentIntent =
        await stripe.paymentIntents.create(params);
      // Send publishable key and PaymentIntent client_secret to client.
      return res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      return res.send({
        error: error.raw.message,
      });
    }
  },
);

app.post('/payment-sheet', async (_, res) => {
  const {secret_key} = getKeys();

  const stripe = new Stripe(secret_key as string, {
    apiVersion: '2022-11-15',
    typescript: true,
  });

  const customers = await stripe.customers.list();

  // Here, we're getting latest customer only for example purposes.
  const customer = customers.data[0];

  if (!customer) {
    return res.send({
      error: 'You have no customer created',
    });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'},
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5099,
    currency: 'usd',
    customer: customer.id,
    // Edit the following to support different payment methods in your PaymentSheet
    // Note: some payment methods have different requirements: https://stripe.com/docs/payments/payment-methods/integration-options
    payment_method_types: [
      'card',
      // 'ideal',
      // 'sepa_debit',
      // 'sofort',
      // 'bancontact',
      // 'p24',
      // 'giropay',
      // 'eps',
      // 'afterpay_clearpay',
      // 'klarna',
      // 'us_bank_account',
    ],
  });
  return res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
});

app.listen(6000, () => console.log('Server up'));
