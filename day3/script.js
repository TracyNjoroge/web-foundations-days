let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];


// 1. searchNotes
function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

console.log(searchNotes("javascript")); 
console.log(searchNotes("pizza")); 



// 2. longestNote
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }

  return longest;
}

console.log(longestNote());
console.log((() => {
  let originalNotes = notes;
  notes = [];
  let result = longestNote();
  notes = originalNotes;
  return result;
})()); 



// 3. countByCategory
function countByCategory() {
  let counts = {};

  for (let note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}

console.log(countByCategory()); 
console.log((() => {
  let originalNotes = notes;
  notes = [];
  let result = countByCategory();
  notes = originalNotes;
  return result;
})()); 



// 4. getSummary
function getSummary() {
  let counts = countByCategory();
  let total = notes.length;

  let parts = [];

  for (let category in counts) {
    parts.push(`${counts[category]} ${category}`);
  }

  let noteWord = total === 1 ? "note" : "notes";

  return `${total} ${noteWord}: ${parts.join(", ")}.`;
}

console.log(getSummary()); 
console.log((() => {
  let originalNotes = notes;
  notes = [{ id: 6, text: "Read", category: "study" }];
  let result = getSummary();
  notes = originalNotes;
  return result;
})());



// 5. isDuplicate
function isDuplicate(text) {
  let searchText = text.trim().toLowerCase();

  return notes.some(note =>
    note.text.trim().toLowerCase() === searchText
  );
}

console.log(isDuplicate("  BUY MILK AND BREAD  ")); 
console.log(isDuplicate("Buy eggs")); 



// 6. addNote
function addNote(text, category) {
  let validCategories = ["personal", "work", "study"];

  if (text.trim().length < 1 || text.length > 200) {
    console.log("Note must be between 1 and 200 characters.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Note is a duplicate.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("Invalid category.");
    return false;
  }

  let newNote = {
    id: notes.length + 1,
    text: text,
    category: category
  };

  notes.push(newNote);

  console.log("Note added successfully.");
  return true;
}

console.log(addNote("Learn JavaScript loops", "study"));
console.log(addNote("Buy milk and bread", "personal"));

