// Demo dữ liệu quiz
const quizData = {
  animal: [
    { word: 'Cat', meaning: 'mèo', options: ['mèo', 'cún'] },
    { word: 'Dog', meaning: 'cún', options: ['mèo', 'cún'] }
  ],
  fruit: [
    { word: 'Apple', meaning: 'táo', options: ['táo', 'chuối'] },
    { word: 'Banana', meaning: 'chuối', options: ['táo', 'chuối'] }
  ]
};

let quizCategory = '';
let quizList = [];
let quizIndex = 0;
let quizAnswers = [];
let quizFinished = false;

const quizCategoryFilter = document.getElementById('quizCategoryFilter');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizBox = document.getElementById('quizBox');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const prevQuizBtn = document.getElementById('prevQuizBtn');
const nextQuizBtn = document.getElementById('nextQuizBtn');
const quizProgressBar = document.getElementById('quizProgressBar');
const quizProgressLabel = document.getElementById('quizProgressLabel');
const quizResultBox = document.getElementById('quizResultBox');
const quizResult = document.getElementById('quizResult');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const quizHistoryTable = document.getElementById('quizHistoryTable');

function getQuizList() {
  if (!quizCategory || quizCategory === '') {
    // All categories
    return Object.values(quizData).flat();
  }
  return quizData[quizCategory] || [];
}

function renderQuiz() {
  if (quizList.length === 0) {
    quizBox.style.display = 'none';
    quizProgressBar.style.width = '0%';
    quizProgressLabel.textContent = 'Progress';
    return;
  }
  quizBox.style.display = '';
  quizResultBox.style.display = 'none';
  const q = quizList[quizIndex];
  quizQuestion.innerHTML = `What is the meaning of "<b>${q.word}</b>"?`;
  quizOptions.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    if (quizAnswers[quizIndex] !== undefined) {
      if (opt === q.meaning) btn.classList.add('correct');
      if (quizAnswers[quizIndex] === opt && opt !== q.meaning) btn.classList.add('incorrect');
    }
    if (quizAnswers[quizIndex] === opt) btn.classList.add('selected');
    btn.onclick = () => {
      if (quizAnswers[quizIndex] !== undefined) return; // Đã chọn rồi thì không cho chọn lại
      quizAnswers[quizIndex] = opt;
      renderQuiz();
    };
    quizOptions.appendChild(btn);
  });
  prevQuizBtn.disabled = quizIndex === 0;
  nextQuizBtn.disabled = quizIndex === quizList.length - 1;
  // Progress
  quizProgressLabel.textContent = `${quizIndex + 1}/${quizList.length}`;
  quizProgressBar.style.width = `${((quizIndex + 1) / quizList.length) * 100}%`;
}

quizCategoryFilter.onchange = function() {
  quizCategory = quizCategoryFilter.value;
  quizList = getQuizList();
  quizIndex = 0;
  quizAnswers = [];
  quizFinished = false;
  quizBox.style.display = 'none';
  quizResultBox.style.display = 'none';
  quizProgressBar.style.width = '0%';
  quizProgressLabel.textContent = 'Progress';
};

startQuizBtn.onclick = function() {
  quizCategory = quizCategoryFilter.value;
  quizList = getQuizList();
  quizIndex = 0;
  quizAnswers = [];
  quizFinished = false;
  renderQuiz();
};

prevQuizBtn.onclick = function() {
  if (quizIndex > 0) {
    quizIndex--;
    renderQuiz();
  }
};
nextQuizBtn.onclick = function() {
  if (quizIndex < quizList.length - 1) {
    quizIndex++;
    renderQuiz();
  } else {
    // Kết thúc quiz
    quizFinished = true;
    showQuizResult();
  }
};

function showQuizResult() {
  quizBox.style.display = 'none';
  quizResultBox.style.display = '';
  // Tính điểm
  let correct = 0;
  quizList.forEach((q, i) => {
    if (quizAnswers[i] === q.meaning) correct++;
  });
  quizResult.innerHTML = `You scored <b>${correct}/${quizList.length}</b>!`;
  // Lưu lịch sử
  saveQuizHistory({
    date: new Date().toLocaleString(),
    category: quizCategory || 'All',
    score: `${correct}/${quizList.length}`
  });
  renderQuizHistory();
}

tryAgainBtn.onclick = function() {
  quizIndex = 0;
  quizAnswers = [];
  quizFinished = false;
  renderQuiz();
};

function saveQuizHistory(entry) {
  let history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  history.unshift(entry);
  if (history.length > 10) history = history.slice(0, 10);
  localStorage.setItem('quizHistory', JSON.stringify(history));
}
function renderQuizHistory() {
  let history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  quizHistoryTable.innerHTML = history.map(h =>
    `<tr><td>${h.date}</td><td>${h.category}</td><td>${h.score}</td></tr>`
  ).join('');
}
// Init
renderQuizHistory();
