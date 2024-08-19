var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { getRole } = require("../middleware/auth");

// Teacher verifies/activates sport by its ID
router.put("/sport/:id", (req, res) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const sportId = req.params.id;

    knex("sports")
      .where("id", sportId)
      .update({ is_verified: 1 }) // update is_verified to 1
      .then((count) => {
        if (count > 0) {
          res.status(200).json({ message: "Sport verified" });
        } else {
          res.status(404).json({ error: "Sport not found" });
        }
      })
      .catch((err) => {
        console.error("Error verifying sport:", err); // Log the error
        res.status(500).json({ error: "Failed to verify sport", details: err });
      });
  }
});

// Teacher verifies/activates student_group by its ID
router.put("/student_group/:id", (req, res) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const studentGroupId = req.params.id;

    knex("student_groups")
      .where("id", studentGroupId)
      .update({ is_verified: 1 }) // update is_verified to 1
      .then((count) => {
        if (count > 0) {
          res.status(200).json({ message: "Student group verified" });
        } else {
          res.status(404).json({ error: "Student group not found" });
        }
      })
      .catch((err) => {
        console.error("Error verifying student group:", err);
        res
          .status(500)
          .json({ error: "Failed to verify student group", details: err });
      });
  }
});

module.exports = router;
