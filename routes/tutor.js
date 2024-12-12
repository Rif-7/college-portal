const express = require("express");
const router = express.Router();
const tutorController = require("../controllers/tutorController");

router.post("/login", tutorController.login);

router.get("/", tutorController.getTutorDetail);

module.exports = router;
