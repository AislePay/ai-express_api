const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('./paypalClient');

module.exports = {
  async createOrder(amount, currency) {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount
        }
      }]
    });

    const response = await payPalClient.client().execute(request);
    return response.result;
  },

  async approveOrder(orderId) {
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await payPalClient.client().execute(request);
    return response.result;
  }
};
