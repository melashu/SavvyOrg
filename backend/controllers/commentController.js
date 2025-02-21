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

module.exports = {
  postComment,
};
