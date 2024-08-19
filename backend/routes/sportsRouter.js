var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { getRole } = require("../middleware/auth");

// ................................................................................

// Get all sports
router.get("/", (req, res, next) => {
  knex("sports")
    .select("sports.*")
    .where("is_verified", 1)
    .leftJoin("students", "sports.id", "students.sport_id")
    .count("students.id as student_count")
    .groupBy("sports.id")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("Error fetching sports data:", err);
      res.status(500).json({ error: err });
    });
});

// Get a single sport by sport.id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  knex("sports")
    .select("*")
    .where("id", "=", id)
    .first()
    .then((row) => {
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ message: "Sport not found" });
      }
    })
    .catch((err) => {
      console.log("SELECT (with ID) FROM `sports` failed", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Add a new sport
router.post("/", (req, res) => {
  // Check for admin role
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to add sport");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  let { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ error: "Sport name is required" });
  }

  // Trim the name
  name = name.trim();

  // Check if sport already exists
  knex("sports")
    .where("name", "=", name)
    .first()  // Using first() as we expect 0 or 1 row
    .then((existingSport) => {
      if (existingSport) {
        return res.status(409).json({ error: "Sport already exists" });  // 409 conflict for duplicates
      }

      // Add sport
      knex("sports")
        .insert({ name: name, is_verified: 1 })
        .then((insertedIds) => {
          // Since MySQL doesn't support returning, fetch the sport after inserting
          return knex("sports").where("id", "=", insertedIds[0]).first();
        })
        .then((newSport) => {
          res.status(201).json(newSport);  // Returning the inserted sport details
        })
        .catch((err) => {
          console.error("Error inserting sport:", err);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((err) => {
      console.error("Error checking existing sport:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});



// edit a single sport by sport.id
router.put("/:id", (req, res) => {
  // for admin only (role 1)
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to edit a sport");
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!req.body.name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const { id } = req.params;
  const updatedSport = {
    name: req.body.name,
    is_verified: 1,
  };

  knex("sports")
    .where("id", id)
    .update(updatedSport)
    .then(updateCount => {
      if (updateCount) {
        res.status(200);
        res.json({ message: `Sport with id ${id} updated` });
      } else {
        res.status(404).json({ error: "Sport not found" });
      }
    })
    .catch(err => {
      console.error("Error updating the sport:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});


// delete a single sport by sport.id
router.delete("/:id", (req, res, next) => {
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to delete sport");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const id = req.params.id;
  knex("sports")
    .where("id", "=", id)
    .del()
    .then(() => {
      res.json({ message: `Sport with id ${id} deleted` });
    })
    .catch((err) => {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res
          .status(400)
          .json({
            error: "Laji ei voitu poistaa, koska laji sisältää oppilaita",
          });
      }
      console.log("Error deleting sport:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
