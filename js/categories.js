// Dữ liệu mẫu
const categories = [];
  
  // DOM elements
  const tableBody = document.getElementById("categoryTableBody");
  const searchInput = document.getElementById("searchInput");
  
  // Render danh sách
  function renderCategories(data) {
    tableBody.innerHTML = "";
  
    if (data.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 3;
      cell.textContent = "No categories found.";
      cell.style.textAlign = "center";
      cell.style.padding = "20px";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }
  
    data.forEach((cat) => {
      const row = document.createElement("tr");
  
      const nameCell = document.createElement("td");
      nameCell.textContent = cat.name;
  
      const descCell = document.createElement("td");
      descCell.textContent = cat.description;
  
      const actionsCell = document.createElement("td");
      actionsCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;
      row.appendChild(nameCell);
      row.appendChild(descCell);
      row.appendChild(actionsCell);
  
      tableBody.appendChild(row);
    });
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
  
  // Khởi tạo ban đầu
  renderCategories(categories);
  
  // Thêm danh mục mới khi nhấn nút "Add New Category"
document.getElementById("addCategoryBtn").addEventListener("click", () => {
    const newCategory = {
      name: "New Category",
      description: "No description"
    };
    categories.push(newCategory);
    renderCategories(categories);
  });
  
  const modal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editDesc = document.getElementById("editDesc");
const saveBtn = document.getElementById("saveEdit");
const cancelBtn = document.getElementById("cancelEdit");
const closeModal = document.getElementById("closeModal");

let editingIndex = null;

// Mở modal khi nhấn Edit
tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const rowIndex = e.target.closest("tr").rowIndex - 1; // bỏ header
    editingIndex = rowIndex;
    editName.value = categories[rowIndex].name;
    editDesc.value = categories[rowIndex].description;
    modal.classList.remove("hidden");
  }
});

// Đóng modal
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
    renderCategories(categories);
    hideModal();
  }
});

const deleteModal = document.getElementById("deleteModal");
const closeDeleteModal = document.getElementById("closeDeleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

let deletingIndex = null;

// Mở modal khi nhấn Delete
tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const rowIndex = e.target.closest("tr").rowIndex - 1;
    deletingIndex = rowIndex;
    deleteModal.classList.remove("hidden");
  }
});

// Đóng modal
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
    renderCategories(categories);
    hideDeleteModal();
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector("#searchInput");
    const rows = document.querySelectorAll(".category-row");
  
    searchInput.addEventListener("input", function () {
      const keyword = this.value.toLowerCase();
  
      rows.forEach((row) => {
        const name = row.querySelector(".category-name").textContent.toLowerCase();
        const description = row.querySelector(".category-description").textContent.toLowerCase();
  
        if (name.includes(keyword) || description.includes(keyword)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  });