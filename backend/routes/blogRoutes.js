const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getAllPublishedArticles,
  getBlogById,
  getArticleById,
  getArticleByTitle,
  updateBlogById,
  deleteBlog,
} = require("../controllers/blogController");

const { postComment, getCommentsByBlogId } = require("../controllers/commentController");

const { upload } = require("../middleware/imageUpload.js");

const router = express.Router();

// Route to create a blog post
router.post("/", upload.single("image"), createBlog);
router.post("/detail/comment", postComment);

// Route to get all blog posts
router.get("/", getAllBlogs);

// Route to get all published articles
router.get("/articles/published", getAllPublishedArticles);

// Route to get blog by id
router.get("/:id", getBlogById);

// Route to get articles by id
router.get("/articles/:id", getArticleById);

// Route to get articles by id
router.get("/articles/detail/title", getArticleByTitle);

router.get("/detail/comments/:blog_id", getCommentsByBlogId);

// Route to update blog by id
router.put("/:id", upload.single("image"), updateBlogById);

// DELETE: Delete a blog post by ID
router.delete("/:id", deleteBlog);

module.exports = router;
