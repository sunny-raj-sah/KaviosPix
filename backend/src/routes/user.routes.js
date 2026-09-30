const express = require("express");

const { createUser } = require("../controllers/user.controller");
const {
  searchUsersByEmail,
} = require("../controllers/user.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", createUser);

router.get(
  "/search",
  authenticate,
  searchUsersByEmail
);

module.exports = router;
