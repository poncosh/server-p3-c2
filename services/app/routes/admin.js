const router = require("express").Router();
const adminController = require("../controllers/adminController");

router
  .get("/categories", adminController.readCategory)
  .get("/posts", adminController.readPost)
  .post("/categories", adminController.postCategory)
  .post("/posts", adminController.postPost)
  .put("/categories/:categoryId", adminController.putCategory)
  .delete("/categories/:categoryId", adminController.deleteCategory)
  .put("/posts/:postId", adminController.putPost)
  .delete("/posts/:postId", adminController.deletePost);

module.exports = router;
