const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/protected", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You have accessed a protected route",
    user: {
      userId: req.user.userId,
      email: req.user.email,
    },
  });
});

module.exports = router;