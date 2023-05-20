// Apple doesn't provide an official Node.js SDK, so you may need to use a third-party library
// such as 'apple-signin-auth' (https://www.npmjs.com/package/apple-signin-auth)

const AppleAuth = require('apple-signin-auth');

const auth = new AppleAuth({
  team_id: process.env.APPLE_TEAM_ID,
  client_id: process.env.APPLE_CLIENT_ID,
  key_id: process.env.APPLE_KEY_ID,
  redirect_uri: process.env.APPLE_REDIRECT_URI,
  scope: 'name email',
}, process.env.APPLE_PRIVATE_KEY);

async function verifyIdToken(idToken) {
  const { email, name } = await auth.verifyIdToken(idToken);
  return { email, name };
}

module.exports = { verifyIdToken };
