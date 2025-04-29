// categories.js

// Đọc dữ liệu từ localStorage
const categories = JSON.parse(localStorage.getItem('categories')) || [];
const words = JSON.parse(localStorage.getItem('words')) || [];

// DOM elements
const tableBody = document.getElementById("categoryTableBody");
const searchInput = document.getElementById("searchInput");
const addCategoryBtn = document.getElementById("addCategoryBtn");

const modal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editDesc = document.getElementById("editDesc");
const saveBtn = document.getElementById("saveEdit");
const cancelBtn = document.getElementById("cancelEdit");
const closeModal = document.getElementById("closeModal");

const deleteModal = document.getElementById("deleteModal");
const closeDeleteModal = document.getElementById("closeDeleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

// Modal elements
const addModal = document.getElementById("addModal");
const addName = document.getElementById("addName");
const addDesc = document.getElementById("addDesc");
const addForm = document.getElementById("addCategoryForm");
const closeAddModal = document.getElementById("closeAddModal");
const cancelAdd = document.getElementById("cancelAdd");

const wordsModal = document.getElementById("wordsModal");
const wordsTableBody = document.getElementById("wordsTableBody");
const categoryNameSpan = document.getElementById("categoryName");
const closeWordsModal = document.getElementById("closeWordsModal");
const closeWordsBtn = document.getElementById("closeWordsBtn");

let editingIndex = null;
let deletingIndex = null;
let currentPage = 1;
const itemsPerPage = 3;

// Render danh sách
function renderCategories(data) {
    tableBody.innerHTML = "";
    const paginationContainer = document.getElementById("pagination");
    if (paginationContainer) paginationContainer.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.style.textAlign = "center";
        cell.style.padding = "20px";
        cell.textContent = "No categories available.";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    // Phân trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    paginatedData.forEach((cat, index) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = cat.name;
        const descCell = document.createElement("td");
        descCell.textContent = cat.description;
        const actionsCell = document.createElement("td");
        actionsCell.innerHTML = `
            <button class="edit-btn" data-index="${startIndex + index}">Edit</button>
            <button class="delete-btn" data-index="${startIndex + index}">Delete</button>
        `;
        row.appendChild(nameCell);
        row.appendChild(descCell);
        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });

    // Render phân trang
    if (paginationContainer) {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        // Previous
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Previous";
        prevBtn.className = "page-btn";
        if (currentPage === 1) prevBtn.disabled = true;
        prevBtn.onclick = () => { 
            if (currentPage > 1) {
                currentPage--;
                renderCategories(data);
            }
        };
        paginationContainer.appendChild(prevBtn);
        // Số trang
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.className = "page-btn";
            if (i === currentPage) pageBtn.classList.add("active-page");
            pageBtn.onclick = () => { currentPage = i; renderCategories(data); };
            paginationContainer.appendChild(pageBtn);
        }
        // Next
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.className = "page-btn";
        if (currentPage === totalPages) nextBtn.disabled = true;
        nextBtn.onclick = () => { 
            if (currentPage < totalPages) {
                currentPage++;
                renderCategories(data);
            }
        };
        paginationContainer.appendChild(nextBtn);
    }
}

// Hiển thị danh sách từ vựng trong category
function showWordsInCategory(categoryName) {
    const categoryWords = words.filter(word => word.category === categoryName);
    
    categoryNameSpan.textContent = categoryName;
    wordsTableBody.innerHTML = "";

    if (categoryWords.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 2;
        cell.style.textAlign = "center";
        cell.style.padding = "20px";
        cell.textContent = "No words in this category.";
        row.appendChild(cell);
        wordsTableBody.appendChild(row);
    } else {
        categoryWords.forEach(word => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${word.word}</td>
                <td>${word.meaning}</td>
            `;
            wordsTableBody.appendChild(row);
        });
    }

    wordsModal.style.display = "flex";
}

// Đóng modal từ vựng
function hideWordsModal() {
    wordsModal.style.display = "none";
}

// Cập nhật localStorage
function saveToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Tìm kiếm
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm) || 
        cat.description.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderCategories(filteredCategories);
});

// Xử lý thêm category mới
function showAddModal() {
    addName.value = "";
    addDesc.value = "";
    addModal.classList.remove("hidden");
}

function hideAddModal() {
    addModal.classList.add("hidden");
}

function addCategory(e) {
    e.preventDefault();
    
    const name = addName.value.trim();
    const description = addDesc.value.trim();

    if (!name) {
        alert("Please enter category name");
        return;
    }

    // Kiểm tra trùng tên category
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        alert("Category name already exists");
        return;
    }

    const newCategory = {
        id: Date.now(),
        name: name,
        description: description || "" // Nếu description rỗng thì gán chuỗi rỗng
    };

    categories.push(newCategory);
    saveToLocalStorage();
    renderCategories(categories);
    hideAddModal();
}

// Gán sự kiện
addCategoryBtn.addEventListener("click", showAddModal);
addForm.addEventListener("submit", addCategory);
closeAddModal.addEventListener("click", hideAddModal);
cancelAdd.addEventListener("click", hideAddModal);

// Mở modal Edit
tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        editingIndex = parseInt(e.target.dataset.index);
        editName.value = categories[editingIndex].name;
        editDesc.value = categories[editingIndex].description;
        modal.classList.remove("hidden");
    } else if (e.target.classList.contains("delete-btn")) {
        deletingIndex = parseInt(e.target.dataset.index);
        deleteModal.classList.remove("hidden");
    }
});

// Đóng modal Edit
function hideModal() {
    modal.classList.add("hidden");
    editingIndex = null;
}
cancelBtn.addEventListener("click", hideModal);
closeModal.addEventListener("click", hideModal);

// Lưu chỉnh sửa
saveBtn.addEventListener("click", () => {
    if (editingIndex !== null) {
        categories[editingIndex].name = editName.value;
        categories[editingIndex].description = editDesc.value;
        saveToLocalStorage();
        renderCategories(categories);
        hideModal();
    }
});

// Đóng modal Delete
function hideDeleteModal() {
    deleteModal.classList.add("hidden");
    deletingIndex = null;
}
closeDeleteModal.addEventListener("click", hideDeleteModal);
cancelDelete.addEventListener("click", hideDeleteModal);

// Xác nhận xoá
confirmDelete.addEventListener("click", () => {
    if (deletingIndex !== null) {
        categories.splice(deletingIndex, 1);
        saveToLocalStorage();
        renderCategories(categories);
        hideDeleteModal();
    }
});

// Gán sự kiện
closeWordsModal.addEventListener("click", hideWordsModal);
closeWordsBtn.addEventListener("click", hideWordsModal);

// Load lần đầu
renderCategories(categories);
