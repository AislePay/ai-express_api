const express = require('express');
const router = express.Router();
const paypalService = require('../services/paypal');

router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const order = await paypalService.createOrder(amount, currency);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/approve-order', async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await paypalService.approveOrder(orderId);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
