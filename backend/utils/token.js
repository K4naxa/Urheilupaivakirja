const jwt = require('jsonwebtoken');
const config = require('./config');

// Create access token
const createAccessToken = (user) => {
  const userForToken = {
    email: user.email,
    user_id: user.id,
    role: user.role_id,
    email_verified: user.email_verified,
  };

  return jwt.sign(userForToken, config.SECRET, {
    expiresIn: '1m', // expires in 60 minutes
  });
};

// Create a refresh token
const createRefreshToken = (user) => {
  const userForToken = {
    email: user.email,
    user_id: user.id,
    role: user.role_id,
    email_verified: user.email_verified,
    token_version: user.token_version //token version is used to invalidate existing tokens if user changes password or chooses to "logout from all devices"
  };

  return jwt.sign(userForToken, config.SECRET, {
    expiresIn: '90d', // expires in 90 days
  });
};

// create both tokens (for initial login)
const createTokens = (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return { accessToken, refreshToken };
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createTokens,
};
