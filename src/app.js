/**
 * server.js
 * ---------------------------------------------------
 * Main entry point for DevTinder Backend API
 * Optimized for:
 * - Render deployment
 * - Secure CORS handling
 * - Clean error handling
 * - Maintainability & scalability
 */

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Database connection
const connectDB = require("./config/database");

// Route modules
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Initialize express app
const app = express();

/* ===================================================
   🌍 CORS CONFIGURATION
   ---------------------------------------------------
   - CLIENT_ORIGIN comes from Render environment vars
   - Supports multiple origins (comma-separated)
   - Required for cookies / JWT auth
=================================================== */

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map(origin => origin.trim())
  : ["http://localhost:5173" , "https://devtinder-frontend-r8d2.onrender.com"]; // fallback for local dev

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      // Allow only whitelisted origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("🚫 CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true // allow cookies / auth headers
  })
);

/* ===================================================
   🧩 GLOBAL MIDDLEWARE
=================================================== */

// Parse JSON request bodies
app.use(express.json());

// Parse cookies from request headers
app.use(cookieParser());

/* ===================================================
   🚀 ROUTES
=================================================== */

// Root route – API info
app.get("/", (req, res) => {
  res.json({
    message: "DevTinder API is running 🚀",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    routes: {
      auth: "/auth",
      profile: "/profile",
      requests: "/request",
      users: "/user",
      health: "/health"
    }
  });
});

// Health check route (Render monitoring)
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API route groups
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

/* ===================================================
   ❌ 404 HANDLER
   (Must be AFTER all routes)
=================================================== */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl
  });
});

/* ===================================================
   ⚠️ GLOBAL ERROR HANDLER
=================================================== */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);

  // Handle CORS errors clearly
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message
  });
});

/* ===================================================
   🗄️ DATABASE CONNECTION
   ---------------------------------------------------
   - Server starts even if DB fails
   - Useful for debugging / health checks
=================================================== */

connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err.message));

/* ===================================================
   🖥️ SERVER STARTUP
=================================================== */

const startServer = () => {
  let PORT = Number(process.env.PORT) || 4444;

  // Validate port number
  if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
    console.error(`Invalid PORT: ${PORT}, using 4444`);
    PORT = 4444;
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("Server started");
    console.log(`   PORT: ${PORT}`);
    console.log(`   ENV: ${process.env.NODE_ENV || "development"}`);
    console.log(`   Allowed Origins: ${allowedOrigins.join(", ")}`);
  });

  // Graceful shutdown (Render / Docker safe)
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  return server;
};

/* ===================================================
   📦 EXPORT & EXECUTION
=================================================== */

// Export app for testing
module.exports = app;

// Start server only if run directly
if (require.main === module) {
  startServer();
}
