// import express from "express";
// import path from "path";
// import connectDB from "./DB/index.js";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import { fileURLToPath } from "url";
// import userRouter from "./Router/user.route.js";
// import jwt from "jsonwebtoken";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//   res.redirect("/users");
// });

// app.use("/users", userRouter);

// app.use((req, res, next) => {
//   const token = req.cookies.accessToken;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       req.user = decoded; // attach to request
//     } catch (err) {
//       req.user = null;
//     }
//   } else {
//     req.user = null;
//   }
//   next();
// });

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
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ✅ JWT auth middleware (before routes)
app.use((req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  res.locals.user = req.user; // ✅ make user available in EJS views
  next();
});

app.get("/", (req, res) => {
  res.redirect("/users");
});

app.use("/users", userRouter);

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB error:", err));
