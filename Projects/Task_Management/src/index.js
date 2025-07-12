import express from "express";
import path from "path";
import connectDB from "./DB/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import userRouter from "./Router/user.route.js";
import subTaskRouter from "./Router/subTodo.route.js";
import taskRouter from "./Router/Task.route.js";
import inquiryRouter from "./Router/inquiry.route.js";
import methodOverride from "method-override";
import session from "express-session";
import jwt from "jsonwebtoken";
import { requireAuth } from "./middleware/requireAuth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(
  session({
    secret: process.env.ACCESS_TOKEN,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Auth Middleware
app.use((req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.jwtUser = decoded;
    } catch (err) {
      console.warn("Invalid token:", err.message);
      req.jwtUser = null;
    }
  } else {
    req.jwtUser = null;
  }

  res.locals.user = req.session?.user || null;
  next();
});

// Routes
app.use("/", inquiryRouter);
app.use("/users", userRouter);
app.use("/task", requireAuth, taskRouter);
app.use("/subTask", subTaskRouter);

connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
