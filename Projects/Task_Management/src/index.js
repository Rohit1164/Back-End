// import express from "express";
// import path from "path";
// import connectDB from "./DB/index.js";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import { fileURLToPath } from "url";
// import userRouter from "./Router/user.route.js";
// import subTaskRouter from "./Router/subTodo.route.js";
// import taskRouter from "./Router/Task.route.js";
// import jwt from "jsonwebtoken";
// import methodOverride from "method-override";
// import session from "express-session";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middlewares
// app.use(
//   session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.use(methodOverride("_method"));
// // app.set("views", "./views");

// app.use((req, res, next) => {
//   const token = req.cookies.accessToken;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       req.user = decoded;
//     } catch (err) {
//       req.user = null;
//     }
//   } else {
//     req.user = null;
//   }
//   res.locals.user = req.session?.user || null; // make user available in all views
//   next();
//   // res.locals.user = req.user;
//   // next();
// });

// app.get("/", (req, res) => {
//   res.redirect("/task");
// });

// app.use("/users", userRouter);
// app.use("/task", taskRouter);
// app.use("/subTask", subTaskRouter);

// connectDB()
//   .then(() => {
//     console.log("DB connected");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server started at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => console.log("MongoDB error:", err));

import express from "express";
import path from "path";
import connectDB from "./DB/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import userRouter from "./Router/user.route.js";
import subTaskRouter from "./Router/subTodo.route.js";
import taskRouter from "./Router/Task.route.js";
import methodOverride from "method-override";
import session from "express-session";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// Middlewares
// --------------------

app.use(
  session({
    secret: process.env.SECRET_KEY,
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

// --------------------
// Auth Middleware (session + optional JWT)
// --------------------

app.use((req, res, next) => {
  // Optional: decode JWT from cookie if present
  const token = req.cookies.accessToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.jwtUser = decoded; // optional if you use JWT elsewhere
    } catch (err) {
      console.warn("Invalid token:", err.message);
      req.jwtUser = null;
    }
  }

  // Session user for login-based pages
  res.locals.user = req.session?.user || null;
  next();
});

// --------------------
// Routes
// --------------------

app.get("/", (req, res) => {
  res.redirect("/task");
});

app.use("/users", userRouter);
app.use("/task", taskRouter);
app.use("/subTask", subTaskRouter);

// --------------------
// DB + Server Start
// --------------------

connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
