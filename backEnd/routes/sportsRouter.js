var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// Get all sports
router.get("/", (req, res, next) => {
  knex("sports")
    .select("*")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("SELECT * FROM `sports` failed");
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
  const sport = req.body;
  knex("sports")
    .insert(sport)
    .then(() => {
      res.json({ message: "Sport added" });
    });
});

// edit a single sport by sport.id
router.put("/:id", (req, res) => {
  console.log("updating sport");

  const updatedSport = {
    id: req.params.id,
    name: req.body.name,
  };
  const id = req.params.id;
  const sport = req.body;
  knex("sports")
    .update(updatedSport)
    .where("id", "=", id)
    .then(() => {
      res.json({ message: `Sport with id ${id} updated` });
    });
});

// delete a single sport by sport.id
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  knex("sports")
    .where("id", "=", id)
    .del()
    .then(() => {
      res.json({ message: `Sport with id ${id} deleted` });
    });
});

module.exports = router;
