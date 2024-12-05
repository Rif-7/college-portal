const { body, validationResult } = require("express-validator");
const { createHash } = require("../utils/auth");
const User = require("../models/User");
const Tutor = require("../models/Tutor");
const TutorTimeTable = require("../models/TutorTimeTable");
const {
  generateInitialSchedule,
  semesters,
  departments,
} = require("../utils/helpers");
const Class = require("../models/Class");
const ClassTimeTable = require("../models/ClassTimeTable");

exports.createTutor = [
  body("username")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Username should be between 3-15 characters")
    .escape()
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("Username already exists");
      }
    }),
  body("password")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 6, max: 30 })
    .withMessage("Password should be between 6-30 characters"),
  body("firstname")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Firstname should be between 1-20 characters")
    .isAlpha()
    .withMessage("Firstname contains invalid characters"),
  body("lastname")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Lastname should be between 1-20 characters")
    .isAlpha()
    .withMessage("Lastname contains invalid characters"),
  body("userType")
    .isString()
    .toLowerCase()
    .withMessage("Invalid format")
    .isIn(["tutor", "student"])
    .withMessage("userType must be either 'tutor' or 'student'"),

  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array() });
      }

      const hashedPassword = await createHash(req.body.password);
      let user = new User({
        username: req.body.username,
        password: hashedPassword,
        userType: req.body.userType,
      });

      user = await user.save();

      let tutorDoc = new Tutor({
        user: user._id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      });

      tutorDoc = await tutorDoc.save();

      // tutor time table document
      let tutorTT = new TutorTimeTable({
        tutor: tutorDoc._id,
        schedule: generateInitialSchedule("class"),
      });

      await tutorTT.save();
      return res.status(200).json({ success: "Tutor created successfully" });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
];

exports.createClass = [
  body("tutor").optional().isMongoId().withMessage("Invalid tutor ID"),
  body("batch")
    .optional()
    .isString()
    .withMessage("Batch name must be a string"),
  body("semester")
    .exists()
    .withMessage("Semester is required")
    .isIn(semesters)
    .withMessage(`Semester must be one of: ${semesters.join(", ")}`),
  body("department")
    .exists()
    .withMessage("Department is required")
    .isIn(departments)
    .withMessage(`Department must be one of: ${departments.join(", ")}`),
  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array() });
      }

      let tutor = null;

      if (req.body.tutor) {
        tutor = await Tutor.findOne({ user: req.body.tutor });
        if (!tutor) {
          return res.status(404).json({ error: "Tutor not found" });
        }
        tutor = tutor._id;
      }

      let classDoc = new Class({
        tutor,
        batch: req.body.batch,
        semester: req.body.semester,
        department: req.body.department,
      });

      classDoc = await classDoc.save();
      // class time table document
      let classTT = new ClassTimeTable({
        class: classDoc._id,
        schedule: generateInitialSchedule("tutor"),
      });

      await classTT.save();
      return res.status(200).json({ success: "Class created successfully" });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
];

// todo
exports.deleteTutor = (req, res, next) => {};
exports.deleteClass = (req, res, next) => {};
