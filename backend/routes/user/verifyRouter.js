var express = require("express");
var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { getRole } = require("../../middleware/auth");

// checks if request was done by admin / role 1 > returns all unverified users
router.put("/:id", (req, res) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const verifiedUser_id = req.params.id;
    console.log(verifiedUser_id);

    const updatedVerification = {
      verified: 1,
    };

    knex("students")
      .where("user_id", "=", verifiedUser_id)
      .update(updatedVerification) // change verified to 1
      .then(() => {
        res.status(200).json({ message: "User verified" });
      });
  }
});

module.exports = router;
