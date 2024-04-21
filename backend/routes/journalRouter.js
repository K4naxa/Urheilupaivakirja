var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
var { getUserId } = require("../middleware/auth");


const { getRole } = require("../middleware/auth");


router.get("/user", async (req, res, next) => {
  const user_id = getUserId(req);
  knex("journal_entries")
    .select(
      "journal_entries.id",
      "journal_entries.length_in_minutes",
      "journal_entries.date",
      "journal_entries.intensity",
      "journal_entries.details",
      "journal_entry_types.name as entry_type",
      "workout_types.name as workout_type",
      "workout_categories.name as workout_category",
      "time_of_day.name as time_of_day"
    )
    .where("journal_entries.user_id", "=", user_id)
    .join("journal_entry_types", "journal_entries.entry_type_id", "journal_entry_types.id")
    .leftJoin("workout_types", "journal_entries.workout_type_id", "workout_types.id")
    .leftJoin("workout_categories", "journal_entries.workout_category_id", "workout_categories.id")
    .leftJoin("time_of_day", "journal_entries.time_of_day_id", "time_of_day.id")
    .orderBy("journal_entries.date", "desc")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.error("SELECT * FROM `journal_entries` failed", err);
      res.status(500).json({ error: err });
    });
});


// Get all journal entries
// TODO: IMPLEMENT PROPER AUTHENTICATION, NOW REQUIRES JUST A WORKING TOKEN
router.get("/", (req, res, next) => {
  knex("journal_entries")
    .select("*")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("SELECT * FROM `journal_entries` failed");
      res.status(500).json({ error: err });
    });
});

// Get a single journal entry by journal_entry.id
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  knex("journal_entries")
    .select("*")
    .where("id", "=", id)
    .first()
    .then((row) => {
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((err) => {
      console.log("SELECT (with ID) FROM `journal_entries` failed", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
