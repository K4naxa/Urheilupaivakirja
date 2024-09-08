const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const bcrypt = require("bcryptjs");

const {
  createAccessToken,
  createRefreshToken,
  createShortRefreshToken,
} = require("../../utils/token");
const { isAuthenticated } = require("../../utils/authMiddleware");
const { email, password } = require("../../utils/validation");
const { validationResult } = require("express-validator");

// user login
router.post("/login", [email, password], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //check if stayLoggedIn exists and if its a boolean and true

  const user = req.body;

  // Check if email exists in the database
  const dbUsers = await knex("users")
    .select(
      "id",
      "email",
      "password",
      "email_verified",
      "role_id",
      "token_version"
    )
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

    let sportName = null;
    if (tempUser.role_id === 3) {
      const sportData = await knex("students")
        .join("sports", "students.sport_id", "sports.id")
        .select("sports.name as sport_name")
        .where("students.user_id", "=", tempUser.id)
        .first();

      if (sportData) {
        sportName = sportData.sport_name;
      }
    }

    // Generate the tokens

    const stayLoggedIn = Boolean(req.body.stayLoggedIn); // Ensuring it's treated as a boolean

    let refreshToken = null;
    let accessToken = null;

    // Check if stayLoggedIn is true, if so, create a long-lived refresh token, otherwise create a short-lived refresh token (1h)
    if (stayLoggedIn) {
      refreshToken = createRefreshToken(tempUser);
      accessToken = createAccessToken(tempUser);

      // Send the tokens to the client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 5 * 60 * 1000,
    });
    } else {
      refreshToken = createShortRefreshToken(tempUser);
      accessToken = createAccessToken(tempUser);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
  
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 5 * 60 * 1000,
      });
    }

    // Update last_login_at on successful login
    await knex("users")
      .where("email", "=", tempUser.email)
      .update({ last_login_at: new Date() });

    // Send the tokens to the client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict",
      maxAge: 1 * 60 * 1000, // 1 minute
    });

    res.status(200).send({
      user_id: tempUser.id,
      email_verified: tempUser.email_verified,
      email: tempUser.email,
      role: tempUser.role_id,
      sport: sportName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", isAuthenticated, (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Successfully logged out" });
});

router.post("/logout/all", isAuthenticated, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // invalidate existing refresh tokens by incrementing the token version
    await knex("users").where("id", "=", user_id).increment("token_version", 1);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res
      .status(200)
      .json({ message: "Successfully logged out from all devices" });
  } catch (error) {
    console.error("Error logging out from all devices:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.post("/refresh-access-token", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(refreshToken, config.SECRET);

    const user = await knex("users")
      .where({ id: decodedToken.user_id })
      .first();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the token version matches
    if (user.token_version !== decodedToken.token_version) {
      return res
        .status(401)
        .json({ message: "Token version mismatch. Please re-authenticate." });
    }
    // New access token
    const accessToken = createAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
