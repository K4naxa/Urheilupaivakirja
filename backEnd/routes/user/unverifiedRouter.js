var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const { getRole } = require("../../middleware/auth");

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  return authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null;
};

// checks if request was done by admin / role 1 > returns all unverified users
router.get("/", (req, res) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const unverifiedUsers = knex("users")
      .where("email_verified", "=", 0)
      .then((rows) => {
        if (rows.length === 0) {
          return res.status(404).json({ error: "No unverified users found" });
        } else {
          res.json(rows);
        }
      });
  }
});

module.exports = router;
