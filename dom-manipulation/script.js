let quotes = [];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.id = "addQuoteForm";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}
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

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  // ✅ Post to server
  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
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
function init() {
  loadQuotes();
  populateCategories();
  createAddQuoteForm(); // ✅ Ensure this is called
  createImportExportControls();
  filterQuotes();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  const syncBtn = document.getElementById("syncQuotesBtn");
  if (syncBtn) syncBtn.addEventListener("click", syncQuotes);
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
    const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated server

// ✅ Fetch quotes from server and return them as an array
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Simulate server quote format using post titles
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
    return [];
  }
}
const SERVER_POST_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated POST endpoint

// ✅ Send a new quote to the server using POST
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}
// ✅ Full sync: fetch from server and post local unsynced quotes
async function syncQuotes() {
  // Step 1: Fetch quotes from server
  const serverQuotes = await fetchQuotesFromServer();

  const localTexts = new Set(quotes.map(q => q.text));
  const newFromServer = [];

  serverQuotes.forEach(serverQuote => {
    if (!localTexts.has(serverQuote.text)) {
      quotes.push(serverQuote);
      newFromServer.push(serverQuote);
    }
  });

  // Step 2: Post all local quotes to server (simulated)
  for (const quote of quotes) {
    await postQuoteToServer(quote);
  }

  // Step 3: Save and update UI
  if (newFromServer.length > 0) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser(`${newFromServer.length} new quote(s) synced from server.`);
  } else {
    notifyUser("Quotes synced successfully. No new server quotes.");
  }
}
// ✅ Full sync: fetch from server and post local unsynced quotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  const localTexts = new Set(quotes.map(q => q.text));
  const newFromServer = [];

  serverQuotes.forEach(serverQuote => {
    if (!localTexts.has(serverQuote.text)) {
      quotes.push(serverQuote);
      newFromServer.push(serverQuote);
    }
  });

  // Simulate posting all local quotes to server
  for (const quote of quotes) {
    await postQuoteToServer(quote);
  }

  // Save and update UI
  if (newFromServer.length > 0) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser(`${newFromServer.length} new quote(s) synced from server.`);
  }

  // ✅ Always show this message after sync
  notifyUser("Quotes synced with server!");
}
function notifyUser(message) {
  const notice = document.createElement("div");
  notice.textContent = message;
  notice.style.background = "#e0f7fa";
  notice.style.border = "1px solid #00796b";
  notice.style.color = "#004d40";
  notice.style.padding = "10px";
  notice.style.marginTop = "10px";
  notice.style.borderRadius = "4px";
  document.body.insertBefore(notice, quoteDisplay);
  setTimeout(() => notice.remove(), 4000);
}


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