var express = require("express");
var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { getRole } = require("../../middleware/auth");

// delete user by id (only admin)
router.delete("/:id", (req, res) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const user_id = req.params.id;

    // Delete associated records in the students table
    knex("users")
      .where("id", "=", user_id)
      .delete()

      .then(() => {
        res.status(200).json({ message: "User deleted" });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
});

module.exports = router;
