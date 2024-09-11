var express = require("express");
var router = express.Router();

const {
  isAuthenticated,
  isStudent,
  isTeacher,
} = require("../../utils/authMiddleware");

/*
const [newNewsEntryData, setNewNewsEntryData] = useState({
  title: "",
  content: "",
  date: initialDate,
  public: true,
  pinned: false,
});
*/

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

router.post("/", isAuthenticated, isTeacher, async (req, res) => {
  const { title, content, public, pinned, date, campuses = [], sports = [], student_groups = [] } = req.body;
  const user_id = req.user.user_id;

  // Validation: Check if required fields are populated
  if (!title || !content || !date) {
    return res.status(400).json({ error: "Title, content, and date are required" });
  }

  try {
    // Insert into the 'news' table and retrieve the news_id using the 'insertId'
    const [news_id] = await knex("news").insert({
      title,
      content,
      public,
      pinned,
      teacher_id: user_id,
      created_at: date,
    });

    // Insert into news_campuses if campuses are provided
    if (campuses.length > 0) {
      const campusIds = await knex("campuses")
        .select("id")
        .whereIn("name", campuses);

      const newsCampusData = campusIds.map((campus) => ({
        news_id: news_id,
        campus_id: campus.id,
      }));

      await knex("news_campuses").insert(newsCampusData);
    }

    // Insert into news_sports if sports are provided
    if (sports.length > 0) {
      const sportIds = await knex("sports")
        .select("id")
        .whereIn("name", sports);

      const newsSportData = sportIds.map((sport) => ({
        news_id: news_id,
        sport_id: sport.id,
      }));

      await knex("news_sports").insert(newsSportData);
    }

    // Insert into news_student_groups if student groups are provided
    if (student_groups.length > 0) {
      const studentGroupIds = await knex("student_groups")
        .select("id")
        .whereIn("name", student_groups);

      const newsStudentGroupData = studentGroupIds.map((studentGroup) => ({
        news_id: news_id,
        student_group_id: studentGroup.id,
      }));

      await knex("news_student_groups").insert(newsStudentGroupData);
    }

    res.status(201).json({ message: "News added successfully" });
  } catch (error) {
    console.error("Error adding news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", isAuthenticated, isTeacher, async (req, res) => {
  const { title, content, public, pinned, date, campuses = [], sports = [], student_groups = [] } = req.body;
  const { id } = req.params;
  const user_id = req.user.user_id;

  // Validation: Check if required fields are populated
  if (!title || !content || !date) {
    return res.status(400).json({ error: "Title, content, and date are required" });
  }

  try {
    // Update the 'news' table
    await knex("news")
      .where({ id })
      .update({
        title,
        content,
        public,
        pinned,
        teacher_id: user_id,
        updated_at: new Date(),
      });

    // Update campuses if provided
    if (campuses.length > 0) {
      const campusIds = await knex("campuses")
        .select("id")
        .whereIn("name", campuses);

      const newsCampusData = campusIds.map((campus) => ({
        news_id: id,
        campus_id: campus.id,
      }));

      // Delete old campus entries and insert new ones
      await knex("news_campuses").where({ news_id: id }).del();
      await knex("news_campuses").insert(newsCampusData);
    }

    // Update sports if provided
    if (sports.length > 0) {
      const sportIds = await knex("sports")
        .select("id")
        .whereIn("name", sports);

      const newsSportData = sportIds.map((sport) => ({
        news_id: id,
        sport_id: sport.id,
      }));

      // Delete old sports entries and insert new ones
      await knex("news_sports").where({ news_id: id }).del();
      await knex("news_sports").insert(newsSportData);
    }

    // Update student groups if provided
    if (student_groups.length > 0) {
      const studentGroupIds = await knex("student_groups")
        .select("id")
        .whereIn("name", student_groups);

      const newsStudentGroupData = studentGroupIds.map((studentGroup) => ({
        news_id: id,
        student_group_id: studentGroup.id,
      }));

      // Delete old student group entries and insert new ones
      await knex("news_student_groups").where({ news_id: id }).del();
      await knex("news_student_groups").insert(newsStudentGroupData);
    }

    res.status(200).json({ message: "News updated successfully" });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", isAuthenticated, isTeacher, async (req, res) => {
  const { id } = req.params;

  try {
    // Delete related entries in news_campuses, news_sports, and news_student_groups
    await knex("news_campuses").where({ news_id: id }).del();
    await knex("news_sports").where({ news_id: id }).del();
    await knex("news_student_groups").where({ news_id: id }).del();

    // Delete the news entry itself
    await knex("news").where({ id }).del();

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Get all news
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const newsRows = await knex("news")
      .select(
        "news.id",
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

// Get news by id
router.get("/:id", isAuthenticated, isTeacher, async (req, res, next) => {
  const { id } = req.params;

  try {
    const news = await knex("news")
      .select(
        "news.id",
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
      .where("news.id", id)
      .first();

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    const campuses = await knex("news_campuses")
      .select("news_id", "name")
      .join("campuses", "news_campuses.campus_id", "campuses.id")
      .where("news_id", id);

    const sports = await knex("news_sports")
      .select("news_id", "name")
      .join("sports", "news_sports.sport_id", "sports.id")
      .where("news_id", id);

    const studentGroups = await knex("news_student_groups")
      .select("news_id", "name")
      .join(
        "student_groups",
        "news_student_groups.student_group_id",
        "student_groups.id"
      )
      .where("news_id", id);

    const newsWithDetails = {
      ...news,
      campuses: campuses.map((c) => c.name.split(",")[0].trim()),
      sports: sports.map((s) => s.name),
      student_groups: studentGroups.map((g) => g.name),
    };

    res.json(newsWithDetails);
  } catch (err) {
    console.log("Error fetching news data", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching news data" });
  }
})

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
  const user_id = req.user.user_id;

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
