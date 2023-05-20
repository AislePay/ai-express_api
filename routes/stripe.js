const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe');

// Create a new Stripe customer
router.post('/customer', async (req, res) => {
  try {
    const { email } = req.body;

    // TODO: Validate the email

    const customer = await stripeService.createCustomer(email);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new payment method
router.post('/payment-method', async (req, res) => {
  try {
    const { customerId, paymentMethodId } = req.body;

    // TODO: Validate the customerId and paymentMethodId

    const paymentMethod = await stripeService.addPaymentMethod(customerId, paymentMethodId);
    res.json(paymentMethod);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new payment intent
router.post('/payment-intent', async (req, res) => {
  try {
    const { amount, currency, customerId, paymentMethodId } = req.body;

    // TODO: Validate the amount, currency, customerId, and paymentMethodId

    const paymentIntent = await stripeService.createPaymentIntent(amount, currency, customerId, paymentMethodId);
    res.json(paymentIntent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
