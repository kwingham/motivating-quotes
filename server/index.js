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

// GET: Retrieve all quotes
app.get("/quotes", async (req, res) => {
  try {
    const sort = req.query.sort || "desc"; // Default sorting order is descending
    const allQuotes = await db.query(
      `SELECT * FROM quotes ORDER BY upvotes ${sort.toUpperCase()}`
    );
    res.json(allQuotes.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET: Retrieve all unique authors
app.get("/authors", async (req, res) => {
  try {
    const authors = await db.query("SELECT DISTINCT author FROM quotes");
    res.json(authors.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET: Retrieve quotes by author
app.get("/quotes/author/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const quotesByAuthor = await db.query(
      "SELECT * FROM quotes WHERE author = $1 ORDER BY upvotes DESC",
      [author]
    );
    res.json(quotesByAuthor.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
