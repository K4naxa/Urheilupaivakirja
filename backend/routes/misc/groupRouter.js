var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// get all groups
router.get("/", async (req, res, next) => {
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
          return knex("student_groups")
            .where("id", "=", insertedIds[0])
            .first();
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", async (req, res, next) => {
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

// Teacher verifies/activates student_group by its ID
router.put("/verify/:id", (req, res) => {
    const role = getRole(req);
    if (role !== 1) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const studentGroupId = req.params.id;
  
      knex("student_groups")
        .where("id", studentGroupId)
        .update({ is_verified: 1 }) // update is_verified to 1
        .then((count) => {
          if (count > 0) {
            res.status(200).json({ message: "Student group verified" });
          } else {
            res.status(404).json({ error: "Student group not found" });
          }
        })
        .catch((err) => {
          console.error("Error verifying student group:", err);
          res
            .status(500)
            .json({ error: "Failed to verify student group", details: err });
        });
    }
  });

module.exports = router;
