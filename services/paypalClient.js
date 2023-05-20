const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID;
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
    if (process.env.NODE_ENV === 'production') {
      return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    }
  
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
  }
  

module.exports = {client: client};
