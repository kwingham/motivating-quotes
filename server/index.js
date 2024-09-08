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
      "INSERT INTO quotes (user_name, quote, author, upvotes) VALUES ($1, $2, $3, 0) RETURNING *",
      [user_name, quote, author]
    );

    res.json(newQuote.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET: Retrieve all quotes, with optional filtering and sorting
app.get("/quotes", async (req, res) => {
  try {
    const { author, sort } = req.query;

    // Base SQL query
    let query = "SELECT * FROM quotes";
    const queryParams = [];

    // Filter by author if provided
    if (author) {
      queryParams.push(author);
      query += ` WHERE author = $${queryParams.length}`;
    }

    // Sort by upvotes if specified
    if (sort) {
      const sortOrder = sort === "ascending" ? "ASC" : "DESC";
      query += ` ORDER BY upvotes ${sortOrder}`;
    }

    const allQuotes = await db.query(query, queryParams);
    res.json(allQuotes.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET: Retrieve distinct authors
app.get("/authors", async (req, res) => {
  try {
    const authors = await db.query("SELECT DISTINCT author FROM quotes");
    res.json(authors.rows.map((row) => row.author));
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// POST: Upvote a quote
app.post("/quotes/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;

    // Update the upvotes count for the quote
    const updatedQuote = await db.query(
      "UPDATE quotes SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *",
      [id]
    );

    if (updatedQuote.rows.length === 0) {
      return res.status(404).send("Quote not found");
    }

    res.json(updatedQuote.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
