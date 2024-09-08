// Import necessary modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db"); // PostgreSQL connection

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Routes

// POST: Add a new quote
app.post("/quotes", async (req, res) => {
  try {
    const { user_name, quote, author } = req.body;

    // Insert into quotes table
    const newQuote = await db.query(
      "INSERT INTO quotes (user_name, quote, author) VALUES ($1, $2, $3) RETURNING *",
      [user_name, quote, author]
    );

    res.json(newQuote.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET: Retrieve all quotes with optional sorting by upvotes
app.get("/quotes", async (req, res) => {
  try {
    // Retrieve the sort query parameter (optional, defaults to 'desc')
    const sort = req.query.sort || "desc";
    const order = sort === "asc" ? "ASC" : "DESC";

    // Query to fetch quotes sorted by upvotes
    const allQuotes = await db.query(
      `SELECT * FROM quotes ORDER BY upvotes ${order}`
    );

    res.json(allQuotes.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
