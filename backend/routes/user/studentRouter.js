var express = require("express");
var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { getRole } = require("../../middleware/auth");

// verify user is admin and return all students
router.get("/", (req, res) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const students = knex("students")
      .where("archived", "=", 0)
      .then((rows) => {
        if (rows.length === 0) {
          return res.status(404).json({ error: "No students found" });
        } else {
          res.json(rows);
        }
      });
  }
});

module.exports = router;
