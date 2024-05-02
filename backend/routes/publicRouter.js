var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getRole, isAuthenticated, getUserId } = require("../middleware/auth");

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
  if (getRole(req) !== 1)
    return res.status(401).json({ error: "Unauthorized" });

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
  if (getRole(req) !== 1)
    return res.status(401).json({ error: "Unauthorized" });

  const { group_identifier } = req.body;

  knex("student_groups")
    .insert({ group_identifier })
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
  if (getRole(req) !== 1)
    return res.status(401).json({ error: "Unauthorized" });

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

// Campus Management -----------------------------------------------------------------

// get all campuses with student count
router.get("/campuses", async (req, res, next) => {
  knex("campuses")
    .select("campuses.*")
    .leftJoin("students", "campuses.id", "students.campus_id")
    .count("students.id as student_count")
    .groupBy("campuses.id")
    .then((rows) => {
      res.json(rows);
    });
});

// create a new campus
router.post("/campuses", isAuthenticated, (req, res, next) => {
  const { name } = req.body;

  knex("campuses")
    .insert({ name })
    .then((id) => {
      res.status(201).json({ id: id[0], name });
    })
    .catch((err) => {
      console.log("Error adding campus", err);
      res
        .status(500)
        .json({ error: "An error occurred while adding the campus" });
    });
});

// check if the user is an admin and then edit the campus
router.put("/campuses/:id", isAuthenticated, (req, res, next) => {
  if (getRole(req) !== 1)
    return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.params;
  const { name } = req.body;

  knex("campuses")
    .where({ id }, "=", "id")
    .update({ name })
    .then(() => {
      res.status(200).json({ id, name });
    })
    .catch((err) => {
      console.log("Error updating campus", err);
      res
        .status(500)
        .json({ error: "An error occurred while updating the campus" });
    });
});

// check if the user is an admin and then delete the campus
router.delete("/campuses/:id", isAuthenticated, (req, res, next) => {
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
      res
        .status(500)
        .json({ error: "An error occurred while deleting the campus" });
    });
});

// Get all news
router.get("/news", async (req, res, next) => {
  
  knex("news")
    .select("*")
    .orderBy("created_at", "desc")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("Error fetching news data", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching news data" });
    });
});

// Get unread news count
router.get("/news/unread", async (req, res, next) => {
  const user_id = getUserId(req);
  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const student = await knex("students")
      .select("news_last_viewed_at")
      .where({ user_id: user_id })
      .first();
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const hasUnreadNews = await knex("news")
      .where("created_at", ">", student.news_last_viewed_at)
      .first();  // We only need to check if at least one exists, not count them all

    // Return true if there are unread news, false otherwise
    res.json({ hasUnreadNews: !!hasUnreadNews });  // !! converts the object to boolean true, undefined to false
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      error: "An error occurred while fetching unread news status",
      details: error.message
    });
  }
});


module.exports = router;
