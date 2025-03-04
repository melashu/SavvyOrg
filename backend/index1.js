const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const userRoutes = require("./routes/userRoutes.js");
const contactRoutes = require("./routes/contactRoutes");
const messageRoutes = require("./routes/messageRoutes");
const blogRoutes = require("./routes/blogRoutes");
const Message = require("./models/messageModel");
const frontendURL = require("./constant/url.js");

dotenv.config();
const app = express();
const server = http.createServer(app);

// Security Middleware: Helmet for setting secure HTTP headers
app.use(helmet());

// Rate Limiting: Limit requests to reduce server load
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", apiLimiter);

// Middleware Configuration
const corsOptions = {
  origin: frontendURL,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Enable morgan only in development for lighter production builds
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(compression());

// Use cookie sessions for session management
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    keys: [process.env.COOKIE_SESSION_KEY],
  })
);

// Initialize passport for authentication and flash messages
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Define routes
app.use("/api/users", userRoutes);
app.use("/contact", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/blogs", blogRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API connected successfully!");
});

// Custom 404 and error handler middleware
app.use(notFound);
app.use(errorHandler);

// Configure Socket.io with optimized options
const io = new Server(server, {
  cors: {
    origin: frontendURL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// Socket.io event handling with error handling and logging
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("send-message", async (message) => {
    try {
      const newMessage = await new Message(message).save();
      io.emit("receive-message", newMessage);
    } catch (error) {
      console.error("Message save failed:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
