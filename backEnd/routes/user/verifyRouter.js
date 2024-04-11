var express = require("express");
var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  return authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null;
};

// Get role from token
const getRole = (req) => {
  const token = getTokenFrom(req);
  let role = null;
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    role = decodedToken.role;
  } catch (error) {
    console.error("JWT verification error in sportsR : ", error.message);
    return res.status(401).json({ error: "Token verification failed" });
  }
  return role;
};

// checks if request was done by admin / role 1 > returns all unverified users
router.put("/", (req, res) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const verifiedUser_id = req.body.id;
    const verifiedUser = req.body;

    const updatedFields = {
      email_verified: 1,
    };

    knex("users")
      .where("id", "=", verifiedUser_id)
      .update(updatedFields) // change email_verified to 1
      .then(() => {
        res.status(200).json({ message: "User verified" });
      });
  }
});

module.exports = router;
