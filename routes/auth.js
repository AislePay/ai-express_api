const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Google OAuth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { token }  = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, email } = ticket.getPayload();

  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({ name, email });
  }

  // Set user session
  req.session.userId = user.id;

  res.json(user);
});

// TODO: Add Apple OAuth

module.exports = router;
