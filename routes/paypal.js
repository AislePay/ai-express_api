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

// Create a new transaction
exports.createTransaction = async (req, res) => {
    const { amount, currency } = req.body;
  
    const request = new paypalService.order.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount,
        }
      }]
    });
  
    try {
      const response = await payPalClient().execute(request);
      res.json({
        status: "success",
        orderID: response.result.id
      });
    } catch (err) {
      res.json({
        status: "error",
        message: err.message
      });
    }
  };

module.exports = router;
