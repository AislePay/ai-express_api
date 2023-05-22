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
    const tokenResponse = await client.linkTokenGet({accessToken});
    return tokenResponse.data;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function createLinkToken(userId) {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: userId, // Associate the link token with the user ID
      },
      client_name: "My App",
      products: ["auth"],
      country_codes: ["US"],
      language: "en",
    });
    return response.data.link_token;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { verifyAccessToken, createLinkToken };
