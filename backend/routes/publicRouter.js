var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getRole, isAuthenticated, getUserId } = require("../middleware/auth");

router.get("/options", async (req, res, next) => {
  Promise.all([
    knex("student_groups").select("*").where("is_verified", 1),
    knex("sports").select("*").where("is_verified", 1),
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
    .select("student_groups.*")
    .where("is_verified", 1)
    .leftJoin("students", "student_groups.id", "students.group_id")
    .count("students.id as student_count")
    .groupBy("student_groups.id")
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

// Add a new group
router.post("/", (req, res) => {
  // Check for admin role
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to add group");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  let { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ error: "Group name is required" });
  }

  // Trim the name
  name = name.trim();

  // Check if group already exists
  knex("student_groups")
    .where("name", "=", name)
    .first() // Using first() as we expect 0 or 1 row
    .then((existingGroup) => {
      if (existingGroup) {
        return res.status(409).json({ error: "Group already exists" }); // 409 conflict for duplicates
      }

      // Add group
      knex("student_groups")
        .insert({ name: name, is_verified: 1 })
        .then((insertedIds) => {
          // Since MySQL doesn't support returning, fetch the group after inserting
          return knex("student_groups").where("id", "=", insertedIds[0]).first();
        })
        .then((newGroup) => {
          res.status(201).json(newGroup); // Returning the inserted group details
        })
        .catch((err) => {
          console.error("Error inserting group:", err);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((err) => {
      console.error("Error checking existing group:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// edit a single group by group.id
router.put("/groups/:id", (req, res) => {
  // for admin only (role 1)
  if (getRole(req) !== 1) {
    console.log("Unauthorized user trying to edit a group");
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!req.body.name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const { id } = req.params;
  const updatedGroup = {
    name: req.body.name,
  };

  knex("student_groups")
    .where("id", id)
    .update(updatedGroup)
    .then((updateCount) => {
      if (updateCount) {
        res.status(200);
        res.json({ message: `Group with id ${id} updated` });
      } else {
        res.status(404).json({ error: "Group not found" });
      }
    })
    .catch((err) => {
      console.error("Error updating the group:", err);
      res.status(500).json({ error: "Internal server error" });
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
      console.log("Error deleting campus", err);

      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Poisto epäonnistui, koska ryhmässä on opiskelijoita.",
        });
      }
      res
        .status(500)
        .json({ error: "An error occurred while deleting the campus." });
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
    })
    .catch((err) => {
      console.log("Error fetching campuses data", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching campuses data" });
    });
});

// Add a new campus
router.post("/campuses", (req, res) => {
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
router.put("/campuses/:id", (req, res) => {
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

// Get all news
router.get("/news", async (req, res, next) => {
  try {
    const newsRows = await knex("news")
      .select(
        "news.id", // Explicitly selecting each column except 'teacher_id'
        "news.title",
        "news.content",
        "news.created_at",
        "news.public",
        "news.pinned",
        knex.raw(
          "concat(teachers.first_name, ' ', teachers.last_name) as author"
        )
      )
      .leftJoin("teachers", "news.teacher_id", "teachers.id")
      .orderBy("created_at", "desc");

    const newsIds = newsRows.map((news) => news.id);

    const campuses = await knex("news_campuses")
      .select("news_id", "name")
      .join("campuses", "news_campuses.campus_id", "campuses.id")
      .whereIn("news_id", newsIds);

    const sports = await knex("news_sports")
      .select("news_id", "name")
      .join("sports", "news_sports.sport_id", "sports.id")
      .whereIn("news_id", newsIds);

    const studentGroups = await knex("news_student_groups")
      .select("news_id", "name")
      .join(
        "student_groups",
        "news_student_groups.student_group_id",
        "student_groups.id"
      )
      .whereIn("news_id", newsIds);

    const newsWithDetails = newsRows.map((newsItem) => ({
      ...newsItem,
      campuses: campuses
        .filter((c) => c.news_id === newsItem.id)
        .map((c) => c.name.split(",")[0].trim()),
      sports: sports
        .filter((s) => s.news_id === newsItem.id)
        .map((s) => s.name),
      student_groups: studentGroups
        .filter((g) => g.news_id === newsItem.id)
        .map((g) => g.name),
    }));

    res.json(newsWithDetails);
  } catch (err) {
    console.log("Error fetching news data", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching news data" });
  }
});

// Get all news as a teacher (includes teacher_id of the teacher who created the news)
router.get("/teacher_news", async (req, res, next) => {
  try {
    const newsRows = await knex("news")
      .select(
        "news.*",
        knex.raw(
          "concat(teachers.first_name, ' ', teachers.last_name) as author"
        )
      )
      .leftJoin("teachers", "news.teacher_id", "teachers.id")
      .orderBy("created_at", "desc");

    const newsIds = newsRows.map((news) => news.id);

    const campuses = await knex("news_campuses")
      .select("news_id", "name")
      .join("campuses", "news_campuses.campus_id", "campuses.id")
      .whereIn("news_id", newsIds);

    const sports = await knex("news_sports")
      .select("news_id", "name")
      .join("sports", "news_sports.sport_id", "sports.id")
      .whereIn("news_id", newsIds);

    const studentGroups = await knex("news_student_groups")
      .select("news_id", "name")
      .join(
        "student_groups",
        "news_student_groups.student_group_id",
        "student_groups.id"
      )
      .whereIn("news_id", newsIds);

    const newsWithDetails = newsRows.map((newsItem) => ({
      ...newsItem,
      campuses: campuses
        .filter((c) => c.news_id === newsItem.id)
        .map((c) => c.name.split(",")[0].trim()),
      sports: sports
        .filter((s) => s.news_id === newsItem.id)
        .map((s) => s.name),
      student_groups: studentGroups
        .filter((g) => g.news_id === newsItem.id)
        .map((g) => g.name),
    }));

    res.json(newsWithDetails);
  } catch (err) {
    console.log("Error fetching news data", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching news data" });
  }
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
      .first(); // We only need to check if at least one exists, not count them all

    // Return true if there are unread news, false otherwise
    res.json({ hasUnreadNews: !!hasUnreadNews }); // !! converts the object to boolean true, undefined to false
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      error: "An error occurred while fetching unread news status",
      details: error.message,
    });
  }
});

module.exports = router;
