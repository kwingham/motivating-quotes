const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Import the database connection

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// GET all quotes
app.get("/quotes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM quotes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new quote
app.post("/quotes", async (req, res) => {
  const { quote, author, user_name } = req.body;
  try {
    const newQuote = await pool.query(
      "INSERT INTO quotes (quote, author, user_name) VALUES ($1, $2, $3) RETURNING *",
      [quote, author, user_name]
    );
    res.json(newQuote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST to upvote a quote
app.post("/quotes/:id/upvote", async (req, res) => {
  const { id } = req.params;
  try {
    const upvotedQuote = await pool.query(
      "UPDATE quotes SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(upvotedQuote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
