// Handles client-side logic for posting, fetching, sorting, and filtering quotes
const form = document.getElementById("quote-form");
const quoteList = document.getElementById("quote-list");
const authorFilter = document.getElementById("author-filter");
const sortOrderButton = document.getElementById("sort-order");

// State variables to keep track of the current sorting and filtering
let currentAuthorFilter = "All Authors";
let currentSortOrder = "Ascending";

// Fetch and display quotes when the page loads or when filters/sorting changes
async function fetchQuotes() {
  let url = "https://motivating-quotes-server.onrender.com/quotes";

  // Apply author filter if not set to "All Authors"
  if (currentAuthorFilter !== "All Authors") {
    url += `?author=${encodeURIComponent(currentAuthorFilter)}`;
  }

  const response = await fetch(url);

  if (response.ok) {
    // Add a check for successful response
    let quotes = await response.json();

    // Sort quotes based on upvotes
    if (currentSortOrder === "Ascending") {
      quotes.sort((a, b) => a.upvotes - b.upvotes);
    } else {
      quotes.sort((a, b) => b.upvotes - a.upvotes);
    }

    // Clear current list
    quoteList.innerHTML = "";

    // Add quotes to the list
    quotes.forEach((quote) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <blockquote>"${quote.quote}" - ${quote.author}</blockquote>
        <p>Posted by: ${quote.user_name}</p>
        <p>Upvotes: ${quote.upvotes}</p>
        <button class="upvote-btn" onclick="upvoteQuote(${quote.id})">Upvote</button>
      `;
      quoteList.appendChild(li);
    });
  } else {
    console.error("Failed to fetch quotes", response.statusText);
  }
}

// Submit form and post a new quote
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user_name = document.getElementById("user-name").value;
  const quote = document.getElementById("quote").value;
  const author = document.getElementById("author").value;

  // POST new quote to the server
  const postResponse = await fetch(
    "https://motivating-quotes-server.onrender.com/quotes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_name, quote, author }),
    }
  );

  if (postResponse.ok) {
    // Clear form fields
    form.reset();
    // Fetch updated quotes
    fetchQuotes();
  } else {
    console.error("Failed to post quote", postResponse.statusText);
  }
});

// Fetch authors dynamically for the filter dropdown
async function fetchAuthors() {
  const response = await fetch(
    "https://motivating-quotes-server.onrender.com/authors"
  );

  if (response.ok) {
    const authors = await response.json();

    // Clear current options
    authorFilter.innerHTML = `<option value="All Authors">Filter by Author</option>`;

    // Add authors to the dropdown
    authors.forEach((author) => {
      const option = document.createElement("option");
      option.value = author;
      option.textContent = author;
      authorFilter.appendChild(option);
    });
  } else {
    console.error("Failed to fetch authors", response.statusText);
  }
}

// Handle author filter change
authorFilter.addEventListener("change", (e) => {
  currentAuthorFilter = e.target.value;
  fetchQuotes();
});

// Handle sort order change
sortOrderButton.addEventListener("click", () => {
  currentSortOrder =
    currentSortOrder === "Ascending" ? "Descending" : "Ascending";
  sortOrderButton.textContent = `Upvotes: ${currentSortOrder}`;
  fetchQuotes();
});

// Upvote a quote
async function upvoteQuote(quoteId) {
  const upvoteResponse = await fetch(
    `https://motivating-quotes-server.onrender.com/quotes/${quoteId}/upvote`,
    {
      method: "POST",
    }
  );

  if (upvoteResponse.ok) {
    // Refresh the quotes list after upvoting
    fetchQuotes();
  } else {
    console.error("Failed to upvote quote", upvoteResponse.statusText);
  }
}

// Load authors, quotes, and set initial UI state when page loads
fetchAuthors();
fetchQuotes();
sortOrderButton.textContent = `Upvotes: ${currentSortOrder}`;
