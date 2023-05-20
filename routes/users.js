const express = require('express');
const router = express.Router();
const User = require('../models/user');
const googleService = require('../services/google');
const appleService = require('../services/apple');

router.post('/signup', async (req, res) => {
  const { provider, idToken } = req.body;

  let email, name;
  if (provider === 'google') {
    ({ email, name } = await googleService.verifyIdToken(idToken));
  } else if (provider === 'apple') {
    ({ email, name } = await appleService.verifyIdToken(idToken));
  }

  const user = await User.create({ email, name });

  res.json(user);
});

module.exports = router;
