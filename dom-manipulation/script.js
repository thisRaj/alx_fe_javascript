// Initial quotes array
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Creativity is intelligence having fun.", category: "Creativity" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// ✅ Function: Display a random quote using innerHTML
function displayRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available for this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <cite>— ${quote.category}</cite>
  `;
}

// ✅ Function: Wrapper for displayRandomQuote
function showRandomQuote() {
  displayRandomQuote();
}

// ✅ Function: Add a new quote
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

// ✅ Function: Update category dropdown
function updateCategoryOptions(newCategory) {
  const exists = Array.from(categoryFilter.options).some(
    opt => opt.value.toLowerCase() === newCategory.toLowerCase()
  );

  if (!exists) {
    const option = document.createElement("option");
    option.value = newCategory;
    option.textContent = newCategory;
    categoryFilter.appendChild(option);
  }
}

// ✅ Function: Dynamically create the Add Quote form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

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

// ✅ Function: Create category filter dropdown
function createCategoryFilter() {
  const label = document.createElement("label");
  label.setAttribute("for", "categoryFilter");
  label.textContent = "Filter by Category:";

  const select = document.createElement("select");
  select.id = "categoryFilter";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All";
  select.appendChild(defaultOption);

  document.body.appendChild(label);
  document.body.appendChild(select);

  select.addEventListener("change", showRandomQuote);
}

// ✅ Initialize the app
function init() {
  createCategoryFilter();
  createAddQuoteForm();
  quotes.forEach(q => updateCategoryOptions(q.category));
  showRandomQuote();
}

// Event listener for "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Start the app
init();