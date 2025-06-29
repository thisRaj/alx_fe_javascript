// Initial quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Creativity is intelligence having fun.", category: "Creativity" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// Helper: Clear all children of an element
function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  clearElement(quoteDisplay);

  if (filteredQuotes.length === 0) {
    const noQuoteMsg = document.createElement("p");
    noQuoteMsg.textContent = "No quotes available for this category.";
    quoteDisplay.appendChild(noQuoteMsg);
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}" — ${quote.category}`;
  quoteDisplay.appendChild(quoteText);
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  updateCategoryOptions(newCategory);

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Update category dropdown
function updateCategoryOptions(newCategory) {
  const existingOptions = Array.from(categoryFilter.options).map(opt => opt.value.toLowerCase());
  if (!existingOptions.includes(newCategory.toLowerCase())) {
    const option = document.createElement("option");
    option.value = newCategory;
    option.textContent = newCategory;
    categoryFilter.appendChild(option);
  }
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// Initial quote display
showRandomQuote();