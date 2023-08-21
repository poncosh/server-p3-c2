const router = require("express").Router();
const userController = require("../controllers/userController");

router
  .get("/homepage", userController.mainPage)
  .get("/details/:slug", userController.detailPage);

module.exports = router;
