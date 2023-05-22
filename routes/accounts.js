const express = require('express');
const router = express.Router();
const LinkedAccount = require('../models/linkedAccount');
const plaidService = require('../services/plaid');
const stripeService = require('../services/stripe');
const paypalService = require('../services/paypal');

router.post('/link', async (req, res) => {
  const { userId, provider, accessToken } = req.body;

  // Verify the access token with the provider's API
  if (provider === 'plaid') {
    await plaidService.verifyAccessToken(accessToken);
  } else if (provider === 'stripe') {
    await stripeService.verifyAccessToken(accessToken);
  } else if (provider === 'paypal') {
    await paypalService.verifyAccessToken(accessToken);
  }

  const account = await LinkedAccount.create({ userId, provider, accessToken });

  res.json(account);
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  const accounts = await LinkedAccount.findAll({ where: { userId } });

  res.json(accounts);
});

router.post('/create', async (req, res) => {
  try {
    const email = req.body.email;
    const service = req.body.service;

    if (!email || !service) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters.',
      });
    }

    let newAccount = null;

    if (service === 'stripe') {
      newAccount = await stripeService.createCustomer(email);
    } else if (service === 'paypal') {
      newAccount = await paypalService.createAccount(email);
    } else if (service === 'plaid') {
      newAccount = await plaidService.createLinkToken();
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid service.',
      });
    }

    return res.status(200).json({
      success: true,
      data: newAccount,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
});

// New routes for Stripe and PayPal operations
// Route to create a payment intent with stripe
router.post('/stripe/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripeService.createPaymentIntent(amount, currency);
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Route to retrieve a payment intent with stripe
router.get('/stripe/retrieve-payment-intent/:paymentIntentId', async (req, res) => {
  const { paymentIntentId } = req.params;
  try {
    const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Route to confirm a payment intent with stripe
router.post('/stripe/confirm-payment-intent', async (req, res) => {
  const { paymentIntentId, paymentMethodId } = req.body;
  try {
    const paymentIntent = await stripeService.confirmPaymentIntent(paymentIntentId, paymentMethodId);
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({error: error.toString() });
  }
});

// Route to create an order with paypal
router.post('/paypal/create-order', async (req, res) => {
  try {
    const orderId = await paypalService.createOrder();
    res.json({ orderId });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Route to capture an order with paypal
router.post('/paypal/capture-order', async (req, res) => {
  const { orderId } = req.body;
  try {
    const captureId = await paypalService.captureOrder(orderId);
    res.json({ captureId });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
