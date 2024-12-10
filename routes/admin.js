const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { ensureAdmin } = require("../utils/auth");

router.get("/tutor", ensureAdmin, adminController.getAllTutors);
router.get("/class", ensureAdmin, adminController.getAllClasses);

router.post("/tutor", ensureAdmin, adminController.createTutor);
router.post("/class", ensureAdmin, adminController.createClass);

router.get("/tutor/:tutorID", ensureAdmin, adminController.getTutorTimeTable);
router.get("/class/:classID", ensureAdmin, adminController.getClassTimeTable);

router.delete("/tutor/:tutorID", ensureAdmin, adminController.deleteTutor);
router.delete("/class/:classID", ensureAdmin, adminController.deleteClass);

router.put(
  "/class/:classID/timetable",
  ensureAdmin,
  adminController.updateClassTT
);
router.delete(
  "class/:classID/timetable",
  ensureAdmin,
  adminController.removeClassTT
);

module.exports = router;
