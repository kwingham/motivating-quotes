// Handles client-side logic for posting and fetching quotes
const form = document.getElementById("quote-form");
const quoteList = document.getElementById("quote-list");
const sortButton = document.getElementById("sort-button"); // Button to toggle sorting

let currentSort = "desc"; // Keep track of the current sorting order (default is descending)

// Fetch and display all quotes with the given sorting order
async function fetchQuotes() {
  const response = await fetch(
    `https://motivating-quotes-server.onrender.com/quotes?sort=${currentSort}`
  );
  const quotes = await response.json();

  // Clear current list
  quoteList.innerHTML = "";

  // Add quotes to the list
  quotes.forEach((quote) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <blockquote>"${quote.quote}" - ${quote.author}</blockquote>
      <p>Posted by: ${quote.user_name}</p>
      <p>Upvotes: ${quote.upvotes}</p>
    `;
    quoteList.appendChild(li);
  });
}

// Submit form and post a new quote
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user_name = document.getElementById("user-name").value;
  const quote = document.getElementById("quote").value;
  const author = document.getElementById("author").value;

  // POST new quote to the server
  await fetch("https://motivating-quotes-server.onrender.com/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_name, quote, author }),
  });

  // Clear form fields
  form.reset();

  // Fetch updated quotes
  fetchQuotes();
});

// Toggle sorting between ascending and descending
sortButton.addEventListener("click", () => {
  currentSort = currentSort === "asc" ? "desc" : "asc"; // Toggle sorting order
  fetchQuotes(); // Fetch quotes with the new sorting order
  sortButton.textContent =
    currentSort === "asc" ? "Sort: Ascending" : "Sort: Descending";
});

// Load quotes on page load
fetchQuotes();
