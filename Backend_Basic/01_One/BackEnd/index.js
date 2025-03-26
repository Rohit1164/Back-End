import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Our Page");
});

app.get("/api/jokes", async (req, res) => {
  const jokes = [
    {
      id: 1,
      title:
        "Why don’t scientists trust atoms? Because they make up everything!",
    },
    {
      id: 2,
      title:
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
    },
    {
      id: 3,
      title: "Why don’t skeletons fight each other? They don’t have the guts.",
    },
  ];
  res.send({ jokes });
});

app.listen(PORT, () => {
  console.log(`Your server started on http://localhost:${PORT}`);
});
