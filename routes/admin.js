const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { ensureAdmin } = require("../utils/auth");

router.post("/login", adminController.login);

router.get("/tutor", ensureAdmin, adminController.getAllTutors);
router.get("/class", ensureAdmin, adminController.getAllClasses);

router.post("/tutor", ensureAdmin, adminController.createTutor);
router.post("/class", ensureAdmin, adminController.createClass);

router.get("/tutor/:tutorID", ensureAdmin, adminController.getTutorDetail);
router.get("/class/:classID", ensureAdmin, adminController.getClassDetail);

router.delete("/tutor/:tutorID", ensureAdmin, adminController.deleteTutor);
router.delete("/class/:classID", ensureAdmin, adminController.deleteClass);

router.put("/tutor/:tutorID", ensureAdmin, adminController.updateTutor);
router.put("/class/:classID", ensureAdmin, adminController.updateClass);

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
