const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const LinkedAccount = require('../models/linkedAccount');
const plaidService = require('../services/plaid');
const stripeService = require('../services/stripe');
const paypalService = require('../services/paypal');
// const zelleService = require('../services/zelle'); // Include this if you have a Zelle service

router.post('/create', async (req, res) => {
  const { userId, linkedAccountId, amount, description } = req.body;

  const linkedAccount = await LinkedAccount.findByPk(linkedAccountId);
  const { provider, accessToken } = linkedAccount;

  // Create a transaction with the provider's API
  if (provider === 'plaid') {
    await plaidService.createTransaction(accessToken, amount, description);
  } else if (provider === 'stripe') {
    await stripeService.createTransaction(accessToken, amount, description);
  } else if (provider === 'paypal') {
    await paypalService.createTransaction(accessToken, amount, description);
  } /* else if (provider === 'zelle') {
    await zelleService.createTransaction(accessToken, amount, description);
  } */

  const transaction = await Transaction.create({ userId, linkedAccountId, amount, description });

  res.json(transaction);
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  const transactions = await Transaction.findAll({ where: { userId } });

  res.json(transactions);
});

module.exports = router;
