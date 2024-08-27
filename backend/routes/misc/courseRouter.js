var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getRole } = require("../../utils/authMiddleware");
const { isAuthenticated, isTeacher } = require("../../utils/authMiddleware");

// get course info
router.get("/segment", isAuthenticated, async (req, res) => {
  console.log(" trying to get course segments");

  try {
    const segments = await knex("course_segments").select("*");
    segments.sort((a, b) => a.order_number - b.order_number);

    res.json(segments);
  } catch (err) {
    console.error("Failed to fetch data", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// add a new course segment
router.post("/segment", isAuthenticated, isTeacher, async (req, res) => {
  try {
    const oldSegmentsCount = await knex("course_segments").count("*", {
      as: "count",
    });
    const segment = req.body;
    segment.created_at = new Date();
    segment.updated_at = new Date();
    segment.order_number = oldSegmentsCount[0].count + 1;
    try {
      await knex("course_segments").insert(segment);
    } catch (err) {
      console.error("Failed to insert data", err);
    }

    res.status(200).json({ message: "Data inserted" });
  } catch (err) {
    console.error("Failed to insert data", err);
    res.status(500).json({ error: "Failed to insert data" });
  }
});

// update course segments
router.put("/segment", isAuthenticated, isTeacher, async (req, res) => {
  try {
    const oldSegments = await knex("course_segments").select("*");
    const newSegments = req.body.segments;
    try {
      await knex.transaction(async (trx) => {
        for (const oldSegment of oldSegments) {
          const newSegment = newSegments.find(
            (segment) => segment.id === oldSegment.id
          );
          if (newSegment) {
            const updatedSegment = { ...newSegment, updated_at: new Date() };
            delete updatedSegment.created_at;
            await trx("course_segments")
              .where({ id: oldSegment.id })
              .update(updatedSegment);
          } else {
            console.error("Failed to update data: no matching segment found");
          }
        }
      });
    } catch (err) {
      console.error("Failed to update data", err);
    }

    res.status(200).json({ message: "Data updated" });
  } catch (err) {
    console.error("Failed to update data", err);
    res.status(500).json({ error: "Failed to update data" });
  }
});

router.delete("/segment/:id", async (req, res) => {
  try {
    const id = req.params.id;
    try {
      await knex("course_segments").where({ id }).del();
    } catch (err) {
      console.error("Failed to delete data", err);
    }

    const unSortedSegments = await knex("course_segments").select("*");
    const segments = unSortedSegments.sort(
      (a, b) => a.order_number - b.order_number
    );
    const updatedSegments = segments.map((segment, index) => ({
      ...segment,
      order_number: index + 1,
    }));

    console.log(updatedSegments);

    try {
      await knex.transaction(async (trx) => {
        for (const updatedSegment of updatedSegments) {
          await trx("course_segments")
            .where({ id: updatedSegment.id })
            .update(updatedSegment);
        }
      });
    } catch (err) {
      console.error("Failed to update data", err);
    }

    res.status(200).json({ message: "Data deleted" });
  } catch (err) {
    console.error("Failed to delete data", err);
    res.status(500).json({ error: "Failed to delete data" });
  }
});

module.exports = router;
