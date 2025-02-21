const Blog = require("../models/blog");

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    const { title, authorId, content, status } = req.body;
    // Ensure the image field is correctly accessed from req.files
    let image = "";
    if (req.file) {
      image = req.file.path;
    }

    const newBlog = new Blog({ title, authorId, content, status, image });
    await newBlog.save();

    res.json({ message: "blog_created", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ error: "Error creating blog post" });
  }
};

// getAllBlogs with Pagination

const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of blogs per page
    const skip = (page - 1) * limit;

    const { status, authorId, role } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (role === "author" && authorId) {
      filter["authorId"] = authorId;
    }

    const totalBlogs = await Blog.countDocuments(filter); // Get the filtered count of blogs
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "authorId",
        select: "_id name",
      })
      .lean();

    res.status(200).json({
      blogs,
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching blogs" });
  }
};

// Get all published articles
const getAllPublishedArticles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const authorId = req.query.authorId;

  try {
    const filter = { status: "published" };
    if (authorId) filter.authorId = authorId;

    // Use selective fields to limit returned data and `lean()` for performance
    const blogQuery = Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title content createdAt") // Only select necessary fields
      .populate("authorId", "name")
      .lean();

    // Conditional countDocuments execution only if it's the first page
    const totalBlogsPromise =
      page === 1 ? Blog.countDocuments(filter) : Promise.resolve(null);

    // Run both queries in parallel
    const [blogs, totalBlogs] = await Promise.all([
      blogQuery,
      totalBlogsPromise,
    ]);

    const totalPages = totalBlogs ? Math.ceil(totalBlogs / limit) : undefined;

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages,
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching blogs" });
  }
};

const getBlogById = async (req, res) => {
  try {
    // Retrieve only the necessary fields with lean() for better performance
    const blogPost = await Blog.findById(req.params.id)
      .lean()
      .select("title content author createdAt");

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(blogPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cache = {}; // Simple in-memory cache for demonstration
const CACHE_TTL = 300000; // Cache duration in milliseconds (e.g., 5 minutes)

// Check if cache entry is valid
const isCacheValid = (cachedEntry) => {
  return cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL;
};

const getArticleById = async (req, res) => {
  const articleId = req.params.id;

  // Check cache first
  if (cache[articleId] && isCacheValid(cache[articleId])) {
    return res.json(cache[articleId].data);
  }

  try {
    // Query the database with lean and select
    const blogPost = await Blog.findById(articleId)
      .lean()
      .select("title content author image createdAt");

    if (!blogPost) {
      return res.status(404).json({ message: "Article not found" });
    }
    // Cache the result with timestamp
    cache[articleId] = {
      data: blogPost,
      timestamp: Date.now(),
    };

    res.json(blogPost);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getArticleByTitle = async (req, res) => {
  console.log("blog data by title");
  console.log(req.query);
  console.log("blog data by title");
  const { title, authorId } = req.query;
  let filter = {};

  filter.title = title;

  filter["authorId"] = authorId;

  try {
    // Query the database with lean and select
    const blogPost = await Blog.findOne(filter)
      .lean()
      .populate({
        path: "comments",
        select: "fullName email comment  createdAt",
      })
      .select("title content author image comments createdAt");

    if (!blogPost) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(blogPost);

    res.json(blogPost);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBlogById = async (req, res) => {
  console.log("Body Data", req.body);
  const { title, authorId, content, status } = req.body;
  // Ensure the image field is correctly accessed from req.files
  let image = "";
  if (req.file) {
    image = req.file.path;
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, authorId, content, status, ...(image && { image }) },
      { new: true }
    );

    if (!updatedBlog)
      return res.status(404).json({ message: "Blog post not found." });

    res.json({ message: "blog_updated", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Error updating the blog post.", error });
  }
};

// DELETE: Delete a blog post by ID
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    res.status(200).json({ message: "Blog post deleted successfully." });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog post." });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getAllPublishedArticles,
  getBlogById,
  getArticleById,
  getArticleByTitle,
  updateBlogById,
  deleteBlog,
};
