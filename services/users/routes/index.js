const router = require("express").Router();
const userControllers = require("../controllers/userControllers");

router
  .post("/register", userControllers.register)
  .post("/login", userControllers.login)
  .get("/:mongoId", userControllers.readUser);

module.exports = router;
