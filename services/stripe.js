const stripe = require('stripe');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

stripe(stripeSecretKey);

// Create a new Stripe customer
const createCustomer = async (email) => {
  try {
    const customer = await stripe.customers.create({
      email: email,
    });
    return customer;
  } catch (err) {
    throw new Error('Failed to create Stripe customer: ' + err.message);
  }
};

// Add a new payment method to a Stripe customer
const addPaymentMethod = async (customerId, paymentMethodId) => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return paymentMethod;
  } catch (err) {
    throw new Error('Failed to add payment method: ' + err.message);
  }
};

// Create a new Stripe payment intent
const createPaymentIntent = async (amount, currency, customerId, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });
    return paymentIntent;
  } catch (err) {
    throw new Error('Failed to create payment intent: ' + err.message);
  }
};

module.exports = {
  createCustomer,
  addPaymentMethod,
  createPaymentIntent,
};