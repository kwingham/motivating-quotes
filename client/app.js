// Handles client-side logic for posting and fetching quotes
const form = document.getElementById("quote-form");
const quoteList = document.getElementById("quote-list");
const sortButton = document.getElementById("sort-button");
const authorDropdown = document.getElementById("author-dropdown"); // Dropdown for authors

let currentSort = "desc"; // Keep track of the current sorting order (default is descending)

// Fetch and display all unique authors for the dropdown
async function fetchAuthors() {
  try {
    const response = await fetch(
      "https://motivating-quotes-server.onrender.com/authors"
    );
    const authors = await response.json();

    // Clear existing options in the dropdown
    authorDropdown.innerHTML = "<option value=''>All Authors</option>"; // Default option

    // Add authors dynamically to the dropdown
    authors.forEach((author) => {
      const option = document.createElement("option");
      option.value = author.author; // Set the value as the author's name
      option.textContent = author.author; // Display the author's name
      authorDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
  }
}

// Fetch and display quotes with optional sorting or author filtering
async function fetchQuotes(author = "") {
  try {
    let url = `https://motivating-quotes-server.onrender.com/quotes?sort=${currentSort}`;

    // If an author is selected, modify the URL to fetch quotes by that author
    if (author) {
      url = `https://motivating-quotes-server.onrender.com/quotes/author/${author}`;
    }

    const response = await fetch(url);
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
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

// Submit form and post a new quote
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user_name = document.getElementById("user-name").value;
  const quote = document.getElementById("quote").value;
  const author = document.getElementById("author").value;

  try {
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
  } catch (error) {
    console.error("Error posting quote:", error);
  }
});

// Toggle sorting between ascending and descending
sortButton.addEventListener("click", () => {
  currentSort = currentSort === "asc" ? "desc" : "asc"; // Toggle sorting order
  fetchQuotes(); // Fetch quotes with the new sorting order
  sortButton.textContent =
    currentSort === "asc" ? "Sort: Ascending" : "Sort: Descending";
});

// Filter quotes by the selected author
authorDropdown.addEventListener("change", () => {
  const selectedAuthor = authorDropdown.value;
  fetchQuotes(selectedAuthor);
});

// Load quotes and authors on page load
fetchQuotes();
fetchAuthors();
