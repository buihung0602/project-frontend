// Lấy dữ liệu từ localStorage hoặc mẫu
let words = JSON.parse(localStorage.getItem('words')) || [
  { word: "Cat", meaning: "mèo", category: "Con vật", learned: false },
  { word: "Dog", meaning: "cún", category: "Con vật", learned: false }
];

let currentIndex = 0;
let showMeaning = false;
let currentCategory = "all";

const categorySelect = document.getElementById('categorySelect');
const flashcardFront = document.getElementById('flashcardFront');
const flashcardBack = document.getElementById('flashcardBack');
const flashcard = document.getElementById('flashcard');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const markLearnedBtn = document.getElementById('markLearnedBtn');
const progressText = document.getElementById('progressText');
const progressFilled = document.getElementById('progressFilled');
const wordListBody = document.getElementById('wordListBody');

function getFilteredWords() {
  if (currentCategory === "all") return words;
  return words.filter(w => w.category === currentCategory);
}

function renderFlashcard() {
  const filtered = getFilteredWords();
  if (filtered.length === 0) {
    flashcardFront.textContent = "No words available";
    flashcardBack.textContent = "";
    progressText.textContent = "0/0";
    progressFilled.style.width = "0%";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    markLearnedBtn.disabled = true;
    return;
  }
  const wordObj = filtered[currentIndex];
  flashcardFront.textContent = showMeaning ? wordObj.meaning : wordObj.word;
  flashcardBack.textContent = showMeaning ? wordObj.word : wordObj.meaning;
  progressText.textContent = `${currentIndex + 1}/${filtered.length}`;
  progressFilled.style.width = `${((currentIndex + 1) / filtered.length) * 100}%`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === filtered.length - 1;
  markLearnedBtn.textContent = wordObj.learned ? "Learned" : "Mark as Learned";
  markLearnedBtn.disabled = wordObj.learned;
}

function renderWordList() {
  const filtered = getFilteredWords();
  wordListBody.innerHTML = filtered.map(w => `
    <tr>
      <td>${w.word}</td>
      <td>${w.meaning}</td>
      <td style="color:${w.learned ? '#27c36a' : '#888'}">${w.learned ? 'Learned' : 'Not Learned'}</td>
    </tr>
  `).join('');
}

flashcard.onclick = function() {
  showMeaning = !showMeaning;
  flashcard.classList.add('tilt');
  setTimeout(() => flashcard.classList.remove('tilt'), 400);
  renderFlashcard();
};

prevBtn.onclick = function() {
  if (currentIndex > 0) {
    currentIndex--;
    showMeaning = false;
    renderFlashcard();
  }
};
nextBtn.onclick = function() {
  const filtered = getFilteredWords();
  if (currentIndex < filtered.length - 1) {
    currentIndex++;
    showMeaning = false;
    renderFlashcard();
  }
};

markLearnedBtn.onclick = function() {
  const filtered = getFilteredWords();
  const wordObj = filtered[currentIndex];
  wordObj.learned = true;
  // Cập nhật lại vào mảng gốc
  const idx = words.findIndex(w => w.word === wordObj.word && w.category === wordObj.category);
  if (idx !== -1) words[idx].learned = true;
  localStorage.setItem('words', JSON.stringify(words));
  renderFlashcard();
  renderWordList();
};

categorySelect.onchange = function() {
  currentCategory = categorySelect.value;
  currentIndex = 0;
  showMeaning = false;
  renderFlashcard();
  renderWordList();
};

function renderCategoryOptions() {
  const categories = Array.from(new Set(words.map(w => w.category)));
  categorySelect.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

renderCategoryOptions();
renderFlashcard();
renderWordList();
