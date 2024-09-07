const { body } = require("express-validator");

const email = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .normalizeEmail()
  .isEmail()
  .withMessage("Invalid email format");

const password = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long"); // Optional, add if you want to ensure a minimum length

const newPassword = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[0-9]/)
  .withMessage("Password must contain at least one number");

const capitalizeFirstLetter = (str) => {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

const nameValidator = (field) =>
  body(field)
    .trim()
    .customSanitizer((value) => {
      return value
        .replace(/\s+/g, "")
        .split("-")
        .map((part) => capitalizeFirstLetter(part))
        .join("-");
    });

const first_name = nameValidator("first_name");
const last_name = nameValidator("last_name");

const user_id = body("pinned_user_id")
  .isInt()
  .withMessage("User ID must be an integer");

const pinned_user_id = body("pinned_user_id")
  .isInt()
  .withMessage("Pinned User ID must be an integer");

const campus_id = body("campus_id")
  .isInt()
  .withMessage("Campus ID must be an integer");

const campus_name = body("campus_name")
  .notEmpty()
  .withMessage("Group name is required")
  .trim()
  .customSanitizer((value) => capitalizeFirstLetter(value))
  .escape();

const sport_id = body("sport_id")
  .isInt()
  .withMessage("Sports ID must be an integer");

const sport_name = body("sport_name")
  .notEmpty()
  .withMessage("Sport name is required")
  .trim()
  .customSanitizer((value) => capitalizeFirstLetter(value))
  .escape();

const group_id = body("group_id")
  .isInt()
  .withMessage("Group ID must be an integer");

const group_name = body("group_name")
  .notEmpty()
  .withMessage("Group name is required")
  .isLength({ max: 15 })
  .withMessage("Group name must be no more than 15 characters")
  .matches(/^\d{4}[a-zA-Z]+$/)
  .withMessage("Group name must start with 4 digits followed by letters")
  .toLowerCase()
  .escape();

const verified = body("verified")
  .isBoolean()
  .withMessage("Verified must be boolean");
const archived = body("archived")
  .isBoolean()
  .withMessage("Archived must be boolean");

const entry_type_id = body("entry_type_id")
  .isInt()
  .withMessage("Entry Type ID must be an integer");
const workout_type_id = body("workout_type_id")
  .isInt()
  .withMessage("Workout Type ID must be an integer");

const workout_category_id = body("workout_category_id")
  .isInt()
  .withMessage("Workout Category ID must be an integer");

const workout_category_name = body("workout_category_name")
  .trim()
  .isLength({ max: 30 })
  .withMessage("Workout Category Name must be no more than 30 characters")
  .customSanitizer((value) => capitalizeFirstLetter(value))
  .escape();

const time_of_day_id = body("time_of_day_id")
  .isInt()
  .withMessage("Time of Day ID must be an integer");

const workout_intensity_id = body("workout_intensity_id")
  .isInt()
  .withMessage("Workout Intensity ID must be an integer");

const length_in_minutes = body("length_in_minutes")
  .isInt()
  .withMessage("Length in minutes must be an integer")
  .custom((value) => {
    if (value % 15 !== 0) {
      throw new Error("Length in minutes must be divisible by 15");
    }
    return true;
  });

const details = body("details").trim().escape();

const date = body("date")
  .notEmpty()
  .withMessage("Date is required")
  .isISO8601()
  .withMessage("Invalid date format")
  .toDate();

const course_segment_id = body("course_segment_id")
  .isInt()
  .withMessage("Course Segment ID must be an integer");
const course_segment_value = body("course_segment_value")
  .isInt()
  .withMessage("Course Segment Value must be an integer");

const course_segment_name = body("course_segment_name")
  .isLength({ max: 30 })
  .withMessage("Course Segment Name must be no more than 30 characters")
  .trim()
  .escape();

const course_segment_order_number = body("course_segment_order.number")
  .isInt()
  .withMessage("Course Segment Order Number must be an integer");

module.exports = {
  email,
  password,
  newPassword,
  first_name,
  last_name,
  user_id,
  pinned_user_id,
  campus_id,
  campus_name,
  sport_id,
  sport_name,
  group_id,
  group_name,
  verified,
  archived,
  entry_type_id,
  workout_type_id,
  workout_category_id,
  workout_category_name,
  workout_intensity_id,
  time_of_day_id,
  length_in_minutes,
  details,
  date,
  course_segment_id,
  course_segment_value,
  course_segment_name,
  course_segment_order_number,
};
