var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  return authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null;
};

// Get role from token
const getRole = (req) => {
  const token = getTokenFrom(req);
  let role = null;
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    role = decodedToken.role;
  } catch (error) {
    console.error("JWT verification error in sportsR : ", error.message);
    return res.status(401).json({ error: "Token verification failed" });
  }
  return role;
};

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
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to add sport");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Check if sport already exists
  knex("sports")
    .select("*")
    .where("name", "=", req.body.name)
    .then((rows) => {
      if (rows.length > 0) {
        return res.status(400).json({ error: "Sport already exists" });
      } else {
        // Add sport
        const sport = req.body;
        knex("sports")
          .insert(sport)
          .then((id_arr) => {
            sport.id = id_arr[0];
            res.json(sport);
          })
          .catch((err) => {
            console.log("Error inserting sport:", err);
            res.status(500).json({ error: "Internal server error" });
          });
      }
    })
    .catch((err) => {
      console.log("Error checking existing sport:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// edit a single sport by sport.id
router.put("/:id", (req, res) => {
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to edit a sport");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

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
    });
});

module.exports = router;
