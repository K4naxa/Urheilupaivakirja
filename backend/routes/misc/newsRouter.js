var express = require("express");
var router = express.Router();

const {
  isAuthenticated,
  isStudent,
  isTeacher,
  isTeacherOrSpectator,
} = require("../../utils/authMiddleware");

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// Get all news
router.get("/", isAuthenticated, async (req, res, next) => {
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
router.get(
  "/teacher_news",
  isAuthenticated,
  isTeacher,
  async (req, res, next) => {
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
  }
);

// Get unread news count
router.get("/unread", isAuthenticated, async (req, res, next) => {
  const user_id = req.user.user_id;
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

// Update student.news_last_viewed_at to current time is found at userRouter.js
router.put("/update-student-news-last-viewed-at", isAuthenticated, isStudent, async (req, res) => {
  console.log("update news last viewed at");
  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await knex("students")
      .where({ user_id: user_id })
      .update({ news_last_viewed_at: new Date() });

    return res.json({ message: "News last viewed at updated successfully" });
  } catch (error) {
    console.error("Error updating news last viewed at:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
