function getAllWords() {
  // Lấy tất cả từ của mọi category
  return Object.values(data).flat();
}

function updateCurrentList() {
  if (currentCategory === 'all') {
    currentList = getAllWords();
  } else {
    currentList = data[currentCategory] || [];
  }
  currentIndex = 0;
}

function renderFlashcard() {
  if (currentList.length === 0) {
    front.textContent = 'No words available';
    back.textContent = '';
    btnPrev.disabled = true;
    btnNext.disabled = true;
    btnLearned.disabled = true;
    flashcard.classList.add('fc-empty');
    return;
  }
  const wordObj = currentList[currentIndex];
  front.textContent = wordObj.word;
  back.textContent = wordObj.meaning;
  btnPrev.disabled = currentIndex === 0;
  btnNext.disabled = currentIndex === currentList.length - 1;
  btnLearned.disabled = wordObj.learned;
  flashcard.classList.remove('fc-empty');
  flashcard.classList.remove('flipped');
}

function renderProgress() {
  const total = currentList.length;
  if (total === 0) {
    progressText.textContent = '0/0';
    progressBar.style.width = '0%';
    return;
  }
  const learnedCount = currentList.filter(w => w.learned).length;
  progressText.textContent = `${learnedCount}/${total}`;
  progressBar.style.width = `${(learnedCount / total) * 100}%`;
}

function renderWordList() {
  let list = currentList;
  if (!list || list.length === 0) {
    wordListBody.innerHTML = '';
    return;
  }
  wordListBody.innerHTML = list.map(w =>
    `<tr>
      <td>${w.word}</td>
      <td>${w.meaning}</td>
      <td class="${w.learned ? 'fc-status-learned' : 'fc-status-notlearned'}">${w.learned ? 'Learned' : 'Not Learned'}</td>
    </tr>`
  ).join('');
}
