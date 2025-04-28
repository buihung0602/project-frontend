// categories.js

// Đọc dữ liệu từ localStorage
const categories = JSON.parse(localStorage.getItem('categories')) || [];

// DOM elements
const tableBody = document.getElementById("categoryTableBody");
const searchInput = document.getElementById("searchInput");

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

let editingIndex = null;
let deletingIndex = null;

// Render danh sách
function renderCategories(data) {
    tableBody.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.style.textAlign = "center";
        cell.style.padding = "20px";
        // cell.textContent = "No categories available.";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    data.forEach((cat, index) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = cat.name;

        const descCell = document.createElement("td");
        descCell.textContent = cat.description;

        const actionsCell = document.createElement("td");
        actionsCell.innerHTML = `
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        row.appendChild(nameCell);
        row.appendChild(descCell);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

// Cập nhật localStorage
function saveToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Tìm kiếm
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = categories.filter(
        (cat) =>
            cat.name.toLowerCase().includes(keyword) ||
            cat.description.toLowerCase().includes(keyword)
    );
    renderCategories(filtered);
});

// Thêm danh mục mới
document.getElementById("addCategoryBtn").addEventListener("click", () => {
    const newCategory = {
        name: "New Category",
        description: "No description"
    };
    categories.push(newCategory);
    saveToLocalStorage();
    renderCategories(categories);
});

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

// Load lần đầu
renderCategories(categories);
