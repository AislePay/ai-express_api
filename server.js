const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { google } = require('googleapis');
const authRoutes = require('./routes/auth');
const accountsRoutes = require('./routes/accounts');
const transactionsRoutes = require('./routes/transactions');


const stripeRoutes = require('./routes/stripe');
const paypalRoutes = require('./routes/paypal');

app.use('/stripe', stripeRoutes);
app.use('/paypal', paypalRoutes);




const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/oauth2callback' // This should be your server's address + '/oauth2callback'
);

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


app.use('/auth', authRoutes);
app.use('/accounts', accountsRoutes);
app.use('/transactions', transactionsRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/login', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  res.redirect(url);
});
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // TODO: Save the tokens to your database

  res.send('Successfully authenticated');
});

app.post('/create_link_token', async (req, res) => {
  const user = {
    client_user_id: 'user-id', // TODO: Replace this with the actual user ID
    legal_name: 'John Doe', // TODO: Replace this with the actual user's name
    // Note: You can include more user information here for a better user experience
  };

  const response = await plaidClient.createLinkToken({
    user,
    client_name: 'Your App Name',
    products: ['auth'],
    country_codes: ['US'],
    language: 'en',
  });

  res.json(response);
});

app.post('/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;

  const response = await plaidClient.exchangePublicToken(public_token);
  const { access_token } = response;

  // TODO: Save the access token to your database

  res.json({ access_token });
});
