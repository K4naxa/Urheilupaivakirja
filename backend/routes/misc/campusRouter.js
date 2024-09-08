var express = require("express");
var router = express.Router();

const { isAuthenticated, isTeacher } = require("../../utils/authMiddleware");

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { campus_name } = require("../../utils/validation");
const { validationResult } = require("express-validator");

// get all campuses with student count
router.get("/", isAuthenticated, isTeacher, async (req, res) => {
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
router.post("/", isAuthenticated, isTeacher, campus_name, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { campus_name } = req.body;

  // Validate input
  if (!campus_name) {
    return res.status(400).json({ error: "Campus name is required" });
  }

  // Trim the campus_name
  campus_name = campus_name.trim();

  // Check if campus already exists
  knex("campuses")
    .where("name", "=", campus_name)
    .first() // Using first() as we expect 0 or 1 row
    .then((existingCampus) => {
      if (existingCampus) {
        return res.status(409).json({ error: "Campus already exists" }); // 409 conflict for duplicates
      }

      // Add campus
      knex("campuses")
        .insert({ name: campus_name })
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

router.put("/merge/", isAuthenticated, isTeacher, async (req, res) => {
  const { mergeFrom, mergeTo } = req.body;
  console.log("mergeFrom", mergeFrom);
  console.log("mergeTo", mergeTo);
  try {
    if (typeof mergeFrom !== "number" || typeof mergeTo !== "number") {
      return res.status(400).json({ error: "Invalid campus IDs" });
    }

    if (mergeFrom === mergeTo) {
      return res
        .status(400)
        .json({ error: "Cannot merge a campus with itself" });
    }

    const fromCampus = await knex("campuses").where("id", mergeFrom).first();
    const toCampus = await knex("campuses").where("id", mergeTo).first();

    if (!fromCampus || !toCampus) {
      return res.status(404).json({ error: "Campus not found" });
    }

    const result = await knex.transaction(async (trx) => {
      //Move students from one campus to another
      const count = await trx("students")
        .where("campus_id", mergeFrom)
        .update({ campus_id: mergeTo });

      return count;
    });

    res.json({
      message: `Merged ${result} students from ${fromCampus.name} to ${toCampus.name}`,
      count: result,
      mergeFrom: fromCampus.name,
      mergeTo: toCampus.name,
    });
  } catch (err) {
    console.error("Error merging campuses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// edit a single campus by campus.id
router.put("/:id", isAuthenticated, isTeacher, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.body.campus_name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const { id } = req.params;
  const updatedCampus = {
    name: req.body.campus_name,
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
router.delete("/:id", isAuthenticated, isTeacher, async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await knex("campuses").where({ id }).del();

    if (result === 0) {
      // No rows were deleted, meaning the campus might not exist
      return res.status(404).json({
        error: "Campus not found or could not be deleted",
      });
    }

    res.status(200).json({ id });
  } catch (err) {
    console.error("Error deleting campus");

    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        error: "Poisto epäonnistui, koska toimipaikalla on opiskelijoita",
      });
    }

    res
      .status(500)
      .json({ error: "An error occurred while deleting the campus" });
  }
});

module.exports = router;
