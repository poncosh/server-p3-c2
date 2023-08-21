const router = require("express").Router();
const mobileControllers = require("../controllers/mobileControllers");

router
  .get("/posts", mobileControllers.getPosts)
  .post("/posts", mobileControllers.postPost)
  .get("/posts/:slug", mobileControllers.getDetail)
  .put("/posts/:postId", mobileControllers.putPost)
  .delete("/posts/:postId", mobileControllers.deletePost);

module.exports = router;
