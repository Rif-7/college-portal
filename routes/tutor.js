const express = require("express");
const router = express.Router();
const tutorController = require("../controllers/tutorController");

router.post("/login", tutorController.login);

module.exports = router;
