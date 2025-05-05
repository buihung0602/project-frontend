// quiz.js

// Lấy dữ liệu từ localStorage
const allWords = JSON.parse(localStorage.getItem('words')) || [
    { word: "apple", meaning: "quả táo", category: "Fruit" },
    { word: "cat", meaning: "con mèo", category: "Animal" },
    { word: "dog", meaning: "con chó", category: "Animal" },
    { word: "banana", meaning: "quả chuối", category: "Fruit" }
];

let quizWords = [];
let quizCategory = "all";
let currentQuestion = 0;
let userAnswers = [];
let quizStarted = false;

// DOM
const startQuizBtn = document.getElementById('startQuizBtn');
const quizCategorySelect = document.getElementById('quizCategorySelect');
const quizArea = document.getElementById('quizArea');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const prevQuizBtn = document.getElementById('prevQuizBtn');
const nextQuizBtn = document.getElementById('nextQuizBtn');
const quizProgressText = document.getElementById('quizProgressText');
const quizResults = document.getElementById('quizResults');
const quizScore = document.getElementById('quizScore');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const quizHistoryBody = document.getElementById('quizHistoryBody');

// Khởi tạo category
function renderCategoryOptions() {
    const categories = Array.from(new Set(allWords.map(w => w.category)));
    quizCategorySelect.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
        quizCategorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}
renderCategoryOptions();

// Bắt đầu quiz
startQuizBtn.onclick = function () {
    quizCategory = quizCategorySelect.value;
    quizWords = quizCategory === "all"
        ? [...allWords]
        : allWords.filter(w => w.category === quizCategory);

    if (quizWords.length === 0) {
        alert("No words available for this category!");
        return;
    }

    quizStarted = true;
    currentQuestion = 0;
    userAnswers = new Array(quizWords.length).fill(null);
    quizArea.style.display = "";
    quizResults.style.display = "none";
    showQuestion();
    updateProgress();
};

// Hiển thị câu hỏi
function showQuestion() {
    if (!quizStarted) return;
    const wordObj = quizWords[currentQuestion];
    quizQuestion.textContent = `What is the meaning of "${wordObj.word}"?`;

    // Tạo các đáp án (1 đúng, 3 sai ngẫu nhiên)
    let options = [wordObj.meaning];
    const otherMeanings = allWords
        .filter(w => w.meaning !== wordObj.meaning)
        .map(w => w.meaning);
    while (options.length < 4 && otherMeanings.length > 0) {
        const idx = Math.floor(Math.random() * otherMeanings.length);
        options.push(otherMeanings.splice(idx, 1)[0]);
    }
    // Trộn đáp án
    options = shuffle(options);

    quizOptions.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = "quiz-option-btn";
        if (userAnswers[currentQuestion] === opt) {
            btn.classList.add("selected");
        }
        btn.onclick = () => {
            userAnswers[currentQuestion] = opt;
            showQuestion();
        };
        quizOptions.appendChild(btn);
    });

    prevQuizBtn.disabled = currentQuestion === 0;
    nextQuizBtn.disabled = currentQuestion === quizWords.length - 1;
    updateProgress();
}

// Trộn mảng
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Điều hướng
prevQuizBtn.onclick = function () {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
};
nextQuizBtn.onclick = function () {
    if (currentQuestion < quizWords.length - 1) {
        currentQuestion++;
        showQuestion();
    }
    // Nếu là câu cuối cùng, tự động hiện kết quả
    if (currentQuestion === quizWords.length - 1) {
        setTimeout(showResults, 300);
    }
};

// Cập nhật tiến trình
function updateProgress() {
    quizProgressText.textContent = `Progress ${currentQuestion + 1}/${quizWords.length}`;
}

// Hiện kết quả
function showResults() {
    quizArea.style.display = "none";
    quizResults.style.display = "";
    let correct = 0;
    for (let i = 0; i < quizWords.length; i++) {
        if (userAnswers[i] === quizWords[i].meaning) correct++;
    }
    quizScore.textContent = `Your score: ${correct}/${quizWords.length}`;
    saveQuizHistory(correct, quizWords.length);
    renderQuizHistory();
}

// Làm lại quiz
tryAgainBtn.onclick = function () {
    quizArea.style.display = "none";
    quizResults.style.display = "none";
    quizStarted = false;
};

// Lưu lịch sử quiz vào localStorage
function saveQuizHistory(score, total) {
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    history.unshift({
        date: new Date().toLocaleString(),
        category: quizCategory,
        score: `${score}/${total}`
    });
    localStorage.setItem('quizHistory', JSON.stringify(history.slice(0, 10)));
}

// Hiển thị lịch sử quiz
function renderQuizHistory() {
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    quizHistoryBody.innerHTML = history.map(h => `
        <tr>
            <td>${h.date}</td>
            <td>${h.category}</td>
            <td>${h.score}</td>
        </tr>
    `).join('');
}

// Load lịch sử khi vào trang
renderQuizHistory();