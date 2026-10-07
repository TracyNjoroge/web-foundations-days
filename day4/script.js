const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");


function updateCounts() {
  const text = noteText.value;
  const characterCount = text.length;

  const wordCountValue = text.trim() === ""
    ? 0
    : text.trim().split(/\s+/).length;

  charCount.textContent = `${characterCount} / 200 characters`;
  wordCount.textContent = `${wordCountValue} words`;

  charCount.classList.remove("warning", "over");

  if (characterCount > 200) {
    charCount.classList.add("over");
  } else if (characterCount > 180) {
    charCount.classList.add("warning");
  }
}


noteText.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("noteDraft", noteText.value);
});


const savedDraft = localStorage.getItem("noteDraft");

if (savedDraft !== null) {
  noteText.value = savedDraft;
}


const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "Light mode";
} else {
  themeToggle.textContent = "Dark mode";
}


updateCounts();


function clearNote() {
  noteText.value = "";
  updateCounts();
  localStorage.removeItem("noteDraft");
}


clearBtn.addEventListener("click", clearNote);


noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearNote();
  }
});


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "Light mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "Dark mode";
    localStorage.setItem("theme", "light");
  }
});