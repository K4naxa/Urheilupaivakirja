var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const saltRounds = config.BCRYPTSALT;
const sendEmail = require("../../utils/email/sendEmail");
const otpGenerator = require("otp-generator");
const {
  getUserId,
  isTeacherOrSpectator,
} = require("../../utils/authMiddleware");
const { isAuthenticated, isTeacher } = require("../../utils/authMiddleware");
const { email, password, newPassword } = require("../../utils/validation");
const { validationResult } = require("express-validator");
const { createAccessToken, createRefreshToken } = require("../../utils/token");

// For user themselves -------------------------------------------------------------------

// ---- Forgotten password ----
// Step #1: Request password reset
router.post("/request-password-reset", email, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // does user exist?
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let firstName = "";

    switch (user.role_id) {
      case 1: // Teacher
        const teacher = await knex("teachers")
          .where({ user_id: user.id })
          .first();
        firstName = teacher ? teacher.first_name : null;
        break;
      case 2: // Spectator
        const spectator = await knex("spectators")
          .where({ user_id: user.id })
          .first();
        firstName = spectator ? spectator.first_name : null;
        break;
      case 3: // Student
        const student = await knex("students")
          .where({ user_id: user.id })
          .first();
        firstName = student ? student.first_name : null;
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    if (!firstName) {
      return res.status(404).json({ message: "First name not found for user" });
    }

    const existingToken = await knex("password_reset_otp")
      .where({ user_id: user.id })
      .orderBy("created_at", "desc")
      .first();

    if (existingToken) {
      const now = Date.now();
      const tokenCreationTime = new Date(existingToken.created_at).getTime();
      const timeSinceLastToken = now - tokenCreationTime;
      const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeSinceLastToken < cooldownPeriod) {
        const remainingTime = cooldownPeriod - timeSinceLastToken;
        const waitTime = Math.ceil(remainingTime / 1000 / 60); // convert to minutes

        return res.status(429).json({
          message: `A reset email has already been sent recently. Please check your email or try again in ${waitTime} minute(s).`,
          wait_time: remainingTime, // in milliseconds
        });
      }
    }

    // if no recent token, delete any old tokens
    await knex("password_reset_otp").where({ user_id: user.id }).del();

    const resetOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const OTP_hash = await bcrypt.hash(resetOTP, Number(saltRounds));

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 1); // 1 hour

    // store the new token in the database
    await knex("password_reset_otp").insert({
      user_id: user.id,
      otp_hash: OTP_hash,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    sendEmail(
      user.email,
      "Password Reset Request",
      { name: firstName, otp: resetOTP },
      "./template/requestResetPassword.handlebars"
    );

    res.json({
      message: "Reset token generated and sent to your email address.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating reset token" });
  }
});

// Step #2: Verify with OTP from email
router.post("/verify-password-reset", email, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp } = req.body;

  try {
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "Email address not recognized." });
    }

    const tokenEntry = await knex("password_reset_otp")
      .where({ user_id: user.id })
      .first();

    if (!tokenEntry) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    const isTokenValid = await bcrypt.compare(otp, tokenEntry.otp_hash);
    const isTokenExpired = new Date() > new Date(tokenEntry.expires_at);

    if (!isTokenValid || isTokenExpired) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    await knex("password_reset_token").where({ user_id: user.id }).del();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(saltRounds));

    await knex("password_reset_token").insert({
      user_id: user.id,
      token_hash: hash,
      expires_at: new Date(Date.now() + 10 * 60000), //10min
    });
    await knex("password_reset_otp").where({ user_id: user.id }).del();
    res.json({ message: "OTP verified successfully", resetToken });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// Step #3: Replace password with new password
router.post("/reset-password", [email, newPassword], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, resetToken, password } = req.body;

  if (!resetToken) {
    return res.status(400).json({ message: "Reset token is required" });
  }

  try {
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "Email address not recognized." });
    }

    const tokenData = await knex("password_reset_token")
      .where({ user_id: user.id })
      .first();

    if (!tokenData) {
      return res.status(404).json({ message: "No token found" });
    }

    if (new Date() > new Date(tokenData.expires_at)) {
      return res
        .status(401)
        .json({ message: "Invalid token or token has expired" });
    }

    const isTokenValid = await bcrypt.compare(resetToken, tokenData.token_hash);

    if (!isTokenValid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Hash the new password and update it in the database
    const hash = await bcrypt.hash(password, Number(saltRounds));
    await knex("users")
      .where({ id: user.id })
      .increment("token_version", 1)
      .update({ password: hash, email_verified: true });

    // Remove the used reset token
    await knex("password_reset_token").where({ user_id: user.id }).del();

    // Increment the token version to invalidate all existing tokens
    await knex("users").where("id", "=", user.id);

    res.json({ message: "Your password has been successfully reset." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

// ---- User self change password ----
router.put(
  "/change-password",
  isAuthenticated,
  newPassword,
  async (req, res) => {
    console.log("oldPassword: ", req.body.oldPassword);
    console.log("password: ", req.body.password);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.user_id;
    const oldPassword = req.body.oldPassword.trim();
    const newPassword = req.body.password.trim();

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new passwords are required" });
    }

    try {
      const user = await knex("users").where({ id: userId }).first();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return res.status(401).json({ message: "Invalid old password" });
      }

      // Check if the new password is the same as the old password
      const isNewPasswordSameAsOld = await bcrypt.compare(
        newPassword,
        user.password
      );
      if (isNewPasswordSameAsOld) {
        return res
          .status(400)
          .json({
            message: "New password cannot be the same as the old password",
          });
      }

      const hash = await bcrypt.hash(newPassword, Number(saltRounds));

      const tempUser = await knex("users")
        .where({ id: userId })
        .increment("token_version", 1)
        .update({ password: hash, email_verified: true });

      // Generate new tokens
      const updatedUser = await knex("users").where({ id: userId }).first();

      const accessToken = createAccessToken(updatedUser);
      const refreshToken = createRefreshToken(updatedUser);

      // Send the new tokens to the client
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, //15 minutes
      });

      // Send success response
      res.status(200).send({
        user_id: tempUser.id,
        email_verified: tempUser.email_verified,
        email: tempUser.email,
        role: tempUser.role_id,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Error updating password" });
    }
  }
);

// ---- User self deletion ----

//delete self with password confirmation -- POST instead of DELETE for password verification (delete has no body)
router.post("/delete/self", isAuthenticated, password, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const password = req.body.password.trim();
  const user_id = req.user.user_id;

  const user = await knex("users").where({ id: user_id }).first();

  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      await knex("users").where("id", "=", user_id).delete();
      return res.status(200).json({ message: "User deleted" });
    } else {
      return res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error during authentication or deletion:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// verify user password (used to check if user can delete their account)
router.post("/verify-password", isAuthenticated, async (req, res) => {
  const userId = req.user.user_id;

  //get password and trim it
  const password = req.body.password.trim();

  try {
    const user = await knex("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Password verified" });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ message: "Error verifying password" });
  }
});

// FOR TEACHERS (ADMINS) -------------------------------------------------------------------
// TODO: CHECK EVERYTHING BELOW
router.delete("/delete/:id", isAuthenticated, isTeacher, async (req, res) => {
  const userIdToDelete = Number(req.params.id);

  if (!userIdToDelete) {
    return res.status(400).json({ error: "Invalid user ID provided." });
  }

  try {
    const user = await knex("users").where("id", "=", userIdToDelete).first();
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user to be deleted is either a student or a spectator
    if (user.role_id !== 2 && user.role_id !== 3) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this user type." });
    }

    await knex("users").where("id", "=", userIdToDelete).delete();
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/delete/teacher/self",
  isAuthenticated,
  isTeacher,
  password,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const password = req.body.password.trim();
    const user_id = req.user.user_id;

    const user = await knex("users").where({ id: user_id }).first();

    try {
      const teacherCount = await knex("users")
        .where("role_id", "=", 1)
        .count({ count: "*" });
      if (teacherCount[0].count <= 1) {
        return res
          .status(403)
          .json({ error: "Cannot delete the last remaining teacher" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        await knex("users").where("id", "=", user_id).delete();
        return res.status(200).json({ message: "User deleted" });
      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } catch (error) {
      console.error("Error during authentication or deletion:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// delete teacher user
router.delete(
  "/delete/teacher/:id",
  isAuthenticated,
  isTeacher,
  async (req, res) => {
    const userIdToDelete = Number(req.params.id);

    try {
      const currentUser = req.user.user_id;

      // Dont allow deleting own account using this route
      if (userIdToDelete === currentUser) {
        return res
          .status(403)
          .json({ error: "You cannot delete your own account" });
      }

      // Fetch the user to be deleted
      const targetUser = await knex("users")
        .where("id", "=", userIdToDelete)
        .first();

      // Check if the user exists
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the target user is a teacher (admin)
      if (targetUser.role_id !== 1) {
        return res.status(403).json({ error: "Can only delete teacher users" });
      }

      // Ensure there are at least 2 teachers (admins) before deleting one
      const teacherCount = await knex("users")
        .where("role_id", "=", 1)
        .count({ count: "*" });

      if (teacherCount[0].count <= 1) {
        return res
          .status(403)
          .json({ error: "Cannot delete the last remaining teacher" });
      }

      // Delete the teacher
      await knex("users").where("id", "=", userIdToDelete).delete();
      return res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
      console.error("Error attempting to delete teacher:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/profile",
  isAuthenticated,
  isTeacherOrSpectator,
  async (req, res) => {
    try {
      const userId = req.user.user_id;
      const role = req.user.role;

      const userData = await knex("users")
        .select("id", "email", "created_at")
        .where("id", userId)
        .first();

      let userNames;

      switch (role) {
        case 1: // Teacher
          userNames = await knex("teachers")
            .select("first_name", "last_name")
            .where("user_id", userId);
          break;
        case 2: // Spectator
          userNames = await knex("spectators")
            .select("first_name", "last_name")
            .where("user_id", userId);
          break;
        default:
          return res.status(400).json({ message: "Invalid user role" });
      }

      const userProfile = { ...userData, ...userNames[0] };

      res.json(userProfile);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
