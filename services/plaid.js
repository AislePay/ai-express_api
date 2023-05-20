const plaid = require('plaid');

// const client = new plaid.Client({
//   clientID: process.env.PLAID_CLIENT_ID,
//   secret: process.env.PLAID_SECRET,
//   env: process.env.PLAID_ENVIRONMENT // Change this to 'development' or 'production' when ready
// });

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);


async function verifyAccessToken(accessToken) {
    try { // Use Plaid's API to verify the access token
        const response = await fetch('http://plaid.com/api/verifyAccessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({accessToken})
        });
        const data = await response.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}




async function createTransaction(accessToken, amount, description) {
    try {
        const transaction = await Plaid.createTransaction(accessToken, amount, description);
        return transaction;
    } catch (err) {
        console.log('Error occurred while creating transaction');
    }
}


module.exports = { verifyAccessToken, createTransaction };
