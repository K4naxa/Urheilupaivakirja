var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getRole, isAuthenticated } = require("../middleware/auth");

router.get("/options", async (req, res, next) => {
  Promise.all([
    knex("student_groups").select("*"),
    knex("sports").select("*"),
    knex("campuses").select("*"),
  ])
    .then((results) => {
      const [student_groups, sports, campuses] = results;

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        student_groups,
        sports,
        campuses,
      });
    })
    .catch((err) => {
      console.log("Error fetching categories data", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching categories data" });
    });
});

// User Group Management -----------------------------------------------------------------

// get all groups
router.get("/groups", async (req, res, next) => {
  knex("student_groups")
    .select("*")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("Error fetching groups data", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching groups data" });
    });
});

// check if the user is an admin and then edit the group
router.put("/groups/:id", async (req, res, next) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.params;
  const { group_identifier } = req.body;

  knex("student_groups")
    .where({ id })
    .update({ group_identifier })
    .then(() => {
      res.status(200).json({ id, group_identifier });
    })
    .catch((err) => {
      console.log("Error updating group", err);
      res
        .status(500)
        .json({ error: "An error occurred while updating the group" });
    });
});

// adds a new group after checking if user is admin
router.post("/groups", async (req, res, next) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { group_identifier } = req.body;

  knex("student_groups")
    .insert({ group_identifier })
    .returning("id")
    .then((id) => {
      res.status(201).json({ id: id[0], group_identifier });
    })
    .catch((err) => {
      console.log("Error adding group", err);
      res
        .status(500)
        .json({ error: "An error occurred while adding the group" });
    });
});

// check if the user is an admin (1) and then delete the group
router.delete("/groups/:id", async (req, res, next) => {
  const role = getRole(req);
  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.params;

  knex("student_groups")
    .where({ id })
    .del()
    .then(() => {
      res.status(200).json({ id });
    })
    .catch((err) => {
      console.log("Error deleting group", err);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the group" });
    });
});

module.exports = router;
