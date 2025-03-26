import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.send("Welcome");
});

app.get("/:name", (req, res) => {
  const name = req.params.name;
  return res.send(`<h1>Welcome to our Page, ${name}!</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
