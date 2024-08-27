var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// get all campuses with student count
router.get("/", async (req, res, next) => {
  knex("campuses")
    .select("campuses.*")
    .leftJoin("students", "campuses.id", "students.campus_id")
    .count("students.id as student_count")
    .groupBy("campuses.id")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("Error fetching campuses data", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching campuses data" });
    });
});

// Add a new campus
router.post("/", (req, res) => {
  // Check for admin role
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to add campus");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  let { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ error: "Campus name is required" });
  }

  // Trim the name
  name = name.trim();

  // Check if campus already exists
  knex("campuses")
    .where("name", "=", name)
    .first() // Using first() as we expect 0 or 1 row
    .then((existingCampus) => {
      if (existingCampus) {
        return res.status(409).json({ error: "Campus already exists" }); // 409 conflict for duplicates
      }

      // Add campus
      knex("campuses")
        .insert({ name: name })
        .then((insertedIds) => {
          // fetch the campus after inserting
          return knex("campuses").where("id", "=", insertedIds[0]).first();
        })
        .then((newCampus) => {
          res.status(201).json(newCampus); // Returning the inserted campus details
        })
        .catch((err) => {
          console.error("Error inserting campus:", err);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((err) => {
      console.error("Error checking existing campus:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// edit a single campus by campus.id
router.put("/:id", (req, res) => {
  // for admin only (role 1)
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to edit a campus");
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!req.body.name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const { id } = req.params;
  const updatedCampus = {
    name: req.body.name,
    is_verified: 1,
  };

  knex("campuses")
    .where("id", id)
    .update(updatedCampus)
    .then((updateCount) => {
      if (updateCount) {
        res.status(200);
        res.json({ message: `Campus with id ${id} updated` });
      } else {
        res.status(404).json({ error: "Campus not found" });
      }
    })
    .catch((err) => {
      console.error("Error updating the campus:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// check if the user is an admin and then delete the campus
router.delete("/:id", (req, res, next) => {
  if (getRole(req) !== 1)
    return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.params;

  knex("campuses")
    .where({ id })
    .del()
    .then(() => {
      res.status(200).json({ id });
    })
    .catch((err) => {
      console.log("Error deleting campus", err);

      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Poisto epäonnistui, koska toimipaikalla on opiskelijoita",
        });
      }
      res
        .status(500)
        .json({ error: "An error occurred while deleting the campus" });
    });
});

module.exports = router;
