// js/dashboard.js
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (currentUser) {
  const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById('user-name').textContent  = fullName;// navbar
  document.getElementById('welcome-msg').textContent =`Chào mừng bạn đã quay lại học, ${fullName}!`; // dòng đậm
}

// Logout
function logout() {
    const ok = confirm('Bạn có chắc muốn đăng xuất không?');
    if (!ok) return;                         // nhấn Cancel → không làm gì
  
    localStorage.removeItem('currentUser');  // xoá phiên
    window.location.href = '../html/login.html';  // quay lại trang đăng nhập
}
  