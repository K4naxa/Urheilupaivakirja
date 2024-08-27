var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { isAuthenticated, isTeacher } = require("../../utils/authMiddleware");

// Get all sports
router.get("/", isAuthenticated, isTeacher, async (req, res) => {
  try {
    const rows = await knex("sports")
      .select("sports.*")
      .where("is_verified", 1)
      .leftJoin("students", "sports.id", "students.sport_id")
      .count("students.id as student_count")
      .groupBy("sports.id");

    res.json(rows);
  } catch (err) {
    console.log("Error fetching sports data:", err);
    res.status(500).json({ error: "Failed to fetch sports data" });
  }
});

// Get a single sport by sport.id
router.get("/:id", isAuthenticated, isTeacher, async (req, res) => {
  const id = req.params.id;
  try {
    const row = await knex("sports").select("*").where("id", "=", id).first();

    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: "Sport not found" });
    }
  } catch (err) {
    console.log("SELECT (with ID) FROM `sports` failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new sport
router.post("/", isAuthenticated, isTeacher, async (req, res) => {
  let { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ error: "Sport name is required" });
  }

  // Trim the name
  name = name.trim();

  try {
    // Check if sport already exists
    const existingSport = await knex("sports").where("name", "=", name).first();

    if (existingSport) {
      return res.status(409).json({ error: "Sport already exists" }); // 409 Conflict for duplicates
    }

    // Add sport
    const insertedIds = await knex("sports").insert({
      name: name,
      is_verified: 1,
    });

    // Fetch the sport after inserting
    const newSport = await knex("sports")
      .where("id", "=", insertedIds[0])
      .first();

    res.status(201).json(newSport); // Returning the inserted sport details
  } catch (err) {
    console.error("Error in sport handling:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// edit a single sport by sport.id
router.put("/:id", isAuthenticated, isTeacher, async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const { id } = req.params;
  const updatedSport = {
    name: req.body.name.trim(),
  };

  try {
    const updateCount = await knex("sports")
      .where("id", id)
      .update(updatedSport);

    if (updateCount) {
      res.json({ message: `Sport with id ${id} updated` });
    } else {
      res.status(404).json({ error: "Sport not found" });
    }
  } catch (err) {
    console.error("Error updating the sport:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete a single sport by sport.id
router.delete("/:id", isAuthenticated, isTeacher, (req, res, next) => {
  const id = req.params.id;
  knex("sports")
    .where("id", "=", id)
    .del()
    .then(() => {
      res.json({ message: `Sport with id ${id} deleted` });
    })
    .catch((err) => {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Laji ei voitu poistaa, koska laji sisältää oppilaita",
        });
      }
      console.log("Error deleting sport:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Teacher verifies/activates sport by its ID
router.put("/verify/:id", isAuthenticated, isTeacher, async (req, res) => {
  const sportId = req.params.id;

  try {
    const count = await knex("sports")
      .where("id", sportId)
      .update({ is_verified: 1 }); // update is_verified to 1

    if (count > 0) {
      res.status(200).json({ message: "Sport verified" });
    } else {
      res.status(404).json({ error: "Sport not found" });
    }
  } catch (err) {
    console.error("Error verifying sport:", err); // Log the error
    res.status(500).json({ error: "Failed to verify sport" });
  }
});

module.exports = router;
