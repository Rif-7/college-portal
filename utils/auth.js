const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const path = require("path");
const User = require("../models/User");
const Tutor = require("../models/Tutor");
const Student = require("../models/Student");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const JWTOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(JWTOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({ _id: jwtPayload.sub });
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

exports.createHash = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hashedPassword) => {
  const res = await bcrypt.compare(password, hashedPassword);
  return !!res;
};

exports.ensureAuth = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info, status) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "User is not authenticated" });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

exports.ensureTutor = async (req, res, next) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) {
      return res.status(403).json({ error: "Access denied. Tutors only" });
    }
    req.tutor = tutor;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.ensureStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ error: "Access denied. Students only" });
    }
    req.student = student;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.ensureAdmin = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info, status) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: "User is not authenticated" });
    }

    if (user.userType !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }

    req.user = user;
    return next();
  })(req, res, next);
};
