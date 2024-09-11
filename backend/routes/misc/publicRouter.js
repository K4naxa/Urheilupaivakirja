const express = require("express");
const router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// get dropdown options for student registration
router.get("/options", async (req, res, next) => {
  try {
    const [student_groups, sports, campuses] = await Promise.all([
      knex("student_groups").select("*").where("is_verified", 1),
      knex("sports").select("*").where("is_verified", 1),
      knex("campuses").select("*"),
    ]);

    res.status(200).json({
      student_groups,
      sports,
      campuses,
    });
  } catch (err) {
    console.error("Error fetching categories data", {
      error: err,
      requestData: req.body,
    });
    res.status(500).json({
      error: "An error occurred while fetching categories data",
    });
  }
});

module.exports = router;
