const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Tutor = require("../models/Tutor");
const { comparePassword } = require("../utils/auth");
const jwt = require("jsonwebtoken");

exports.login = [
  body("username")
    .exists()
    .withMessage("Username is missing")
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Invalid username")
    .custom(async (username, { req }) => {
      const user = await User.findOne({ username });
      if (!user || user.userType !== "admin") {
        throw new Error("Incorrect username");
      }
      req.user = user;
    }),
  body("password")
    .exists()
    .withMessage("Password is missing")
    .trim()
    .isLength({ min: 6, max: 30 })
    .withMessage("Invalid password"),
  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array() });
      }

      const tutor = await Tutor.findOne({ user: req.user._id });
      if (!tutor) {
        return res
          .status(400)
          .json({ errror: "Incorrect username or password" });
      }

      if (!comparePassword(req.body.password, req.user.password)) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      const payload = {
        sub: req.user.id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
];
