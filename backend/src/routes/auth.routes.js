const express = require("express");
const passport = require("../config/passport");

const { googleCallback } = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");

const {
  getCurrentUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleCallback
);

router.get("/google/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});

 //me route
router.get(
  "/me",
  authenticate,
  getCurrentUser
);

module.exports = router;