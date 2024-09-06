document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quote-form");
  const quoteList = document.getElementById("quote-list");

  // Function to load and display quotes
  function loadQuotes() {
    fetch("http://localhost:5000/quotes")
      .then((res) => res.json())
      .then((data) => {
        quoteList.innerHTML = ""; // Clear the list
        data.forEach((quote) => {
          const li = document.createElement("li");
          li.innerHTML = `<blockquote>"${quote.quote}" - ${quote.author}</blockquote>
                          <p>Posted by: ${quote.user_name}</p>
                          <p>Upvotes: ${quote.upvotes} <button data-id="${quote.id}" class="upvote-btn">Upvote</button></p>`;
          quoteList.appendChild(li);
        });
      });
  }

  // Handle form submission to post a new quote
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user_name = document.getElementById("user_name").value;
    const quote = document.getElementById("quote").value;
    const author = document.getElementById("author").value;

    fetch("http://localhost:5000/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name, quote, author }),
    }).then(() => {
      loadQuotes();
      form.reset(); // Reset the form
    });
  });

  // Handle upvotes
  quoteList.addEventListener("click", (e) => {
    if (e.target.classList.contains("upvote-btn")) {
      const id = e.target.getAttribute("data-id");
      fetch(`http://localhost:5000/quotes/${id}/upvote`, {
        method: "POST",
      }).then(() => loadQuotes());
    }
  });

  // Load quotes on page load
  loadQuotes();
});
