const express = require('express');
const router = express.Router();
const LinkedAccount = require('../models/linkedAccount');
const plaidService = require('../services/plaid');
const stripeService = require('../services/stripe');
const paypalService = require('../services/paypal');
// const zelleService = require('../services/zelle'); // Include this if you have a Zelle service

router.post('/link', async (req, res) => {
  const { userId, provider, accessToken } = req.body;

  // Verify the access token with the provider's API
  if (provider === 'plaid') {
    await plaidService.verifyAccessToken(accessToken);
  } else if (provider === 'stripe') {
    await stripeService.verifyAccessToken(accessToken);
  } else if (provider === 'paypal') {
    await paypalService.verifyAccessToken(accessToken);
  } /* else if (provider === 'zelle') {
    await zelleService.verifyAccessToken(accessToken);
  } */

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


module.exports = router;
