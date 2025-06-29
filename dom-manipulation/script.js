let quotes = [];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// ✅ Load quotes and filter from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Creativity is intelligence having fun.", category: "Creativity" }
  ];
  saveQuotes();
}

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Save selected category to localStorage
function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// ✅ Load selected category from localStorage
function loadSelectedCategory() {
  return localStorage.getItem("selectedCategory") || "all";
}

// ✅ Populate category dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedCategory = loadSelectedCategory();
  categoryFilter.value = savedCategory;
}

// ✅ Filter and display quotes based on selected category
function filterQuotes() {
  const selected = categoryFilter.value;
  saveSelectedCategory(selected);

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available for this category.</p>`;
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <blockquote>"${random.text}"</blockquote>
    <cite>— ${random.category}</cite>
  `;
}

// ✅ Wrapper for filterQuotes
function showRandomQuote() {
  filterQuotes();
}

// ✅ Add a new quote and update categories
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ✅ Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// ✅ Import quotes from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Failed to parse JSON.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Initialize app
function init() {
  loadQuotes();
  populateCategories();
  filterQuotes();
  // Periodically sync every 30 seconds
setInterval(syncWithServer, 30000);

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("syncNow").addEventListener("click", syncWithServer);
}

init();
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated endpoint

// ✅ Fetch quotes from server and sync with local
async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate server quotes format
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    const localTexts = new Set(quotes.map(q => q.text));
    let newQuotes = [];

    serverQuotes.forEach(serverQuote => {
      if (!localTexts.has(serverQuote.text)) {
        quotes.push(serverQuote);
        newQuotes.push(serverQuote);
      }
    });

    if (newQuotes.length > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      notifyUser(`${newQuotes.length} new quote(s) synced from server.`);
    }
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// ✅ Notify user of sync or conflict
function notifyUser(message) {
  const notice = document.createElement("div");
  notice.textContent = message;
  notice.style.background = "#fffae6";
  notice.style.border = "1px solid #ccc";
  notice.style.padding = "10px";
  notice.style.marginTop = "10px";
  document.body.insertBefore(notice, quoteDisplay);
  setTimeout(() => notice.remove(), 5000);
}