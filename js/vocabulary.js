// vocabulary.js

// Đọc dữ liệu từ localStorage
let words = JSON.parse(localStorage.getItem('words')) || [];

// DOM Elements
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const vocabTableBody = document.getElementById("vocabTableBody");

const addWordBtn = document.getElementById("addWordBtn");
const wordModal = document.getElementById("wordModal");
const deleteModal = document.getElementById("deleteModal");

const modalTitle = document.getElementById("modalTitle");
const wordInput = document.getElementById("wordInput");
const meaningInput = document.getElementById("meaningInput");
const categoryInput = document.getElementById("categoryInput");

const closeModalBtn = document.getElementById("closeModal");
const cancelModalBtn = document.getElementById("cancelModal");

const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let editingWordId = null;
let deletingWordId = null;


let currentPage = 1;
const wordsPerPage = 3;

// Render từ vựng
function renderWords() {
    const selectedCategory = categoryFilter.value;
    const searchText = searchInput.value.toLowerCase();

    const filteredWords = words.filter(w => {
        const matchCategory = selectedCategory === "all" || w.category === selectedCategory;
        const matchSearch = w.word.toLowerCase().includes(searchText) || w.meaning.toLowerCase().includes(searchText);
        return matchCategory && matchSearch;
    });

    const startIndex = (currentPage - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    const paginatedWords = filteredWords.slice(startIndex, endIndex);

    vocabTableBody.innerHTML = "";

    paginatedWords.forEach(w => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${w.word}</td>
            <td>${w.meaning}</td>
            <td>${w.category}</td>
            <td>
                <button class="edit-btn" onclick="editWord(${w.id})">Edit</button>
                <button class="delete-btn" onclick="confirmDelete(${w.id})">Delete</button>
            </td>
        `;
        vocabTableBody.appendChild(row);
    });

    renderPagination(filteredWords.length); // Thêm dòng này để vẽ phân trang
}

function renderPagination(totalWords) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    if (totalWords === 0) {
        paginationContainer.style.display = "none";
        return;
    } else {
        paginationContainer.style.display = "flex";
    }

    const totalPages = Math.ceil(totalWords / wordsPerPage);

    // Thêm nút Previous
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.className = "page-btn";
    if (currentPage === 1) {
        prevBtn.disabled = true;
    }
    prevBtn.addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            renderWords();
        }
    });
    paginationContainer.appendChild(prevBtn);

    // Thêm các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "page-btn";
        if (i === currentPage) {
            btn.classList.add("active-page");
        }
        btn.addEventListener("click", function() {
            currentPage = i;
            renderWords();
        });
        paginationContainer.appendChild(btn);
    }

    // Thêm nút Next
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.className = "page-btn";
    if (currentPage === totalPages) {
        nextBtn.disabled = true;
    }
    nextBtn.addEventListener("click", function() {
        if (currentPage < totalPages) {
            currentPage++;
            renderWords();
        }
    });
    paginationContainer.appendChild(nextBtn);
}


// Cập nhật danh sách category trong filter
function updateCategoryFilter() {
    const categories = ["all"];

    words.forEach(w => {
        if (!categories.includes(w.category)) {
            categories.push(w.category);
        }
    });

    categories.sort((a, b) => {
        if (a === "all") return -1;
        if (b === "all") return 1;
        return a.localeCompare(b);
    });

    categoryFilter.innerHTML = categories.map(c => {
        return `<option value="${c}">${c === "all" ? "All Categories" : c}</option>`;
    }).join("");
}

// Open Add Modal
function openAddModal() {
    editingWordId = null;
    modalTitle.textContent = "Add New Word";
    wordInput.value = "";
    meaningInput.value = "";
    renderCategoryOptions();
    categoryInput.value = "";
    wordModal.style.display = "flex";
}

// Open Edit Modal
function editWord(id) {
    const wordObj = words.find(w => w.id === id);
    if (!wordObj) return;

    editingWordId = id;
    modalTitle.textContent = "Edit Word";
    wordInput.value = wordObj.word;
    meaningInput.value = wordObj.meaning;
    renderCategoryOptions();
    categoryInput.value = wordObj.category;
    wordModal.style.display = "flex";
}

function renderCategoryOptions() {
    // Lấy danh sách category từ localStorage
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    categoryInput.innerHTML = '<option value="">Select Category</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        categoryInput.appendChild(option);
    });
}

// Save Word
function saveWord(e) {
    e.preventDefault();

    const word = wordInput.value.trim();
    const meaning = meaningInput.value.trim();
    const category = categoryInput.value.trim();

    if (!word || !meaning || !category) {
        alert("Please fill all fields.");
        return;
    }

    if (editingWordId) {
        const wordObj = words.find(w => w.id === editingWordId);
        if (wordObj) {
            wordObj.word = word;
            wordObj.meaning = meaning;
            wordObj.category = category;
        }
    } else {
        const newWord = {
            id: Date.now(),
            word,
            meaning,
            category
        };
        words.push(newWord);
    }

    localStorage.setItem('words', JSON.stringify(words)); // <-- lưu dữ liệu

    closeModals();
    renderWords();
    updateCategoryFilter();
}

// Confirm Delete
function confirmDelete(id) {
    deletingWordId = id;
    deleteModal.style.display = "flex";
}

// Delete Word
function deleteWord() {
    words = words.filter(w => w.id !== deletingWordId);
    deletingWordId = null;

    localStorage.setItem('words', JSON.stringify(words)); // <-- lưu dữ liệu

    closeModals();
    renderWords();
    updateCategoryFilter();
}

// Close Modals
function closeModals() {
    wordModal.style.display = "none";
    deleteModal.style.display = "none";
}

// Gán sự kiện
addWordBtn.addEventListener("click", openAddModal);
document.getElementById("wordForm").addEventListener("submit", saveWord);

closeModalBtn.addEventListener("click", closeModals);
cancelModalBtn.addEventListener("click", closeModals);

closeDeleteModalBtn.addEventListener("click", closeModals);
cancelDeleteBtn.addEventListener("click", closeModals);
confirmDeleteBtn.addEventListener("click", deleteWord);

categoryFilter.addEventListener("change", renderWords);
<<<<<<< HEAD
searchInput.addEventListener("input", function() {
    currentPage = 1; // Reset về trang 1 khi tìm kiếm
    renderWords();
});
=======
searchInput.addEventListener("input", renderWords);
>>>>>>> f76e6f8715d8ab4697bc65c3a8b0b1a5dbe54dbe

// Load dữ liệu ban đầu
renderWords();
updateCategoryFilter();
