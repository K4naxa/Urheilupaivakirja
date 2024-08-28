const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');
const config = require('../../utils/config');
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const bcrypt = require('bcryptjs');


const { createAccessToken, createRefreshToken, createTokens } = require('../../utils/token');
const { isAuthenticated } = require('../../utils/authMiddleware');


// user login
router.post("/login", async (req, res, next) => {
    const user = req.body;
  
    // Check if email and password are provided
    if (!user.email || !user.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (user.password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!emailRegex.test(user.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
  
    // Check if email exists in the database
    const dbUsers = await knex("users")
      .select("id", "email", "password", "email_verified", "role_id", "token_version")
      .where("email", "=", user.email);
  
    if (dbUsers.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  
    // After email is found, check if password is correct
    try {
      const tempUser = dbUsers[0];
      const passwordCorrect = await bcrypt.compare(
        user.password,
        tempUser.password
      );
  
      if (!passwordCorrect) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Generate the tokens
      const accessToken = createAccessToken(tempUser);
      const refreshToken = createRefreshToken(tempUser);
  
      // Update last_login_at on successful login
      await knex("users")
        .where("email", "=", tempUser.email)
        .update({ last_login_at: new Date() });
  
      // Send the tokens to the client
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000, // 15 minutes
      });

      res.status(200).send({
        user_id: tempUser.id,
        email_verified: tempUser.email_verified,
        email: tempUser.email,
        role: tempUser.role_id,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/logout', isAuthenticated, (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });
    res.status(200).json({ message: "Successfully logged out" });
});

router.post('/logout/all', isAuthenticated, async (req, res) => {
  try {
      const user_id = req.user.user_id;

      // invalidate existing refresh tokens by incrementing the token version
      await knex('users')
          .where('id', '=', user_id)
          .increment('token_version', 1);

      res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict'
      });
      res.clearCookie('accessToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict'
      });

      res.status(200).json({ message: "Successfully logged out from all devices" });
  } catch (error) {
      console.error("Error logging out from all devices:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


router.post('/refresh-access-token', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, config.SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Retrieve the user from the database
    const user = await knex('users').where({ id: decodedToken.user_id }).first();

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if the token version matches
    if (user.token_version !== decodedToken.token_version) {
      return res.status(401).json({ message: 'Token version mismatch. Please re-authenticate.' });
    }
    
    const accessToken = createAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 1 * 60 * 1000, // 15 minutes
    });

    res.json({ accessToken });
  });
});

module.exports = router;
