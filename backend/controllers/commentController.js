const Blog = require("../models/blog");
const Comment = require("../models/comment");

const postComment = async (req, res) => {
  try {
    console.log("comment post from blog detail viewers");
    console.log(req.body);
    console.log("comment post from blog detail viewers");

    const data = req.body;

    const blogId = data.blogId;
    const fullName = data.comment.fullName;
    const email = data.comment.email;
    const comment = data.comment.comment;

    if (!blogId || !comment) {
      return res
        .status(400)
        .json({ message: "Blog ID and comment are required" });
    }

    // Create new comment
    const newComment = new Comment({ blogId, fullName, email, comment });
    await newComment.save();

    // Associate comment with blog
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: newComment._id },
    });

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all comments for a specific blog
const getCommentsByBlogId = async (req, res) => {
  try {
      const { blog_id } = req.params;

    if (!blog_id) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalComments = await Comment.countDocuments({ blogId: blog_id });

    const comments = await Comment.find({ blogId: blog_id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      comments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};



module.exports = {
  postComment, getCommentsByBlogId
};
