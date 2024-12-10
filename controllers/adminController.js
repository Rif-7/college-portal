const { body, validationResult } = require("express-validator");
const { createHash } = require("../utils/auth");
const User = require("../models/User");
const Tutor = require("../models/Tutor");
const TutorTimeTable = require("../models/TutorTimeTable");
const {
  generateInitialSchedule,
  semesters,
  departments,
  days,
  isValidMongoID,
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
        userType: "user",
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

exports.getAllTutors = async (req, res, next) => {
  try {
    const tutors = await Tutor.find();
    return res.status(200).json({ tutors });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find().populate("tutor", "firstname lastname");
    return res.status(200).json({ classes });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.getTutorTimeTable = async (req, res, next) => {
  try {
    if (!isValidMongoID(req.params.tutorID)) {
      return res.status(400).json({ error: "Invalid or missing tutor ID" });
    }
    const tutor = await Tutor.findById(req.params.tutorID).populate(
      "timetable"
    );
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }
    return res.status(200).json({ tutor });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.getClassTimeTable = async (req, res, next) => {
  try {
    if (isValidMongoID(req.params.classID)) {
      return res.status(400).json({ error: "Invalid or missing class ID" });
    }

    const classDoc = await Class.findById(req.params.classID).populate(
      "timetable"
    );
    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    return res.status(200).json({ class: classDoc });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.updateClassTT = [
  body("day")
    .exists()
    .withMessage("Day is missing")
    .isIn(days)
    .withMessage("Invalid day"),
  body("period")
    .exists()
    .withMessage("Period number is missing")
    .custom((value, { req }) => {
      const maxPeriods = req.body.day === "friday" ? 6 : 7;
      if (value < 0 || value > maxPeriods) {
        throw new Error(`Invalid period number for ${req.body.day}`);
      }
      return true;
    }),
  body("subjectCode")
    .exists()
    .withMessage("Subject code is missing")
    .isString()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Invalid subject code"),
  body("tutor")
    .exists()
    .withMessage("Tutor ID is missing")
    .isMongoId()
    .withMessage("invalid Mongo ID"),

  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array() });
      }

      if (!isValidMongoID(req.params.classID)) {
        return res.status(400).json({ error: "Invalid or missing class ID" });
      }

      const classTT = await ClassTimeTable.findOne({
        class: req.params.classID,
      });
      if (!classTT) {
        return res.status(404).json({ error: "Class time table not found" });
      }

      const tutorTT = await TutorTimeTable.findOne({ tutor: req.body.tutor });
      if (!tutorTT) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      const { day, period } = req.body;
      const currentTutorID = classTT.schedule[day][period].tutor;

      // if the period is already assigned then remove the period from the current tutor
      if (currentTutorID) {
        const currentTutorTT = await TutorTimeTable.findOne({
          tutor: currentTutorID,
        });
        currentTutorID.schedule[day][period] = {
          subjectCode: "",
          class: null,
        };

        await currentTutorTT.save();
      }

      classTT.schedule[day][period] = {
        subjectCode: req.body.subjectCode,
        tutor: req.body.tutor,
      };
      await classTT.save();

      tutorTT.schedule[day][period] = {
        subjectCode: req.body.subjectCode,
        class: req.params.classID,
      };
      await tutorTT.save();

      return res
        .status(200)
        .json({ success: "Time table updated successfully" });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
];

exports.removeClassTT = [
  body("day")
    .exists()
    .withMessage("Day is missing")
    .isIn(days)
    .withMessage("Invalid day"),
  body("period")
    .exists()
    .withMessage("Period number is missing")
    .custom((value, { req }) => {
      const maxPeriods = req.body.day === "friday" ? 6 : 7;
      if (value < 0 || value > maxPeriods) {
        throw new Error(`Invalid period number for ${req.body.day}`);
      }
      return true;
    }),
  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array() });
      }

      if (!isValidMongoID(req.params.classID)) {
        return res.status(400).json({ error: "Invalid or missing class ID" });
      }

      const classTT = await ClassTimeTable.findOne({
        class: req.params.classID,
      });

      if (!classTT) {
        return res.status(404).json({ error: "Class time table not found" });
      }

      const { day, period } = req.body;
      const currentTutorID = classTT.schedule[day][period].tutor;

      // if the period is already assigned then remove the period from the current tutor
      if (currentTutorID) {
        const currentTutorTT = await TutorTimeTable.findOne({
          tutor: currentTutorID,
        });
        currentTutorID.schedule[day][period] = {
          subjectCode: "",
          class: null,
        };

        await currentTutorTT.save();
      }

      classTT.schedule[day][period] = {
        subjectCode: "",
        tutor: null,
      };
      await classTT.save();

      return res
        .status(200)
        .json({ success: "Time table updated successfully" });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
];

// TODO's
exports.deleteTutor = (req, res, next) => {};
exports.deleteClass = (req, res, next) => {};
