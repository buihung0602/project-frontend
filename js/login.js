function handleLogin() {
    const email       = document.getElementById('email').value.trim();
    const password    = document.getElementById('password').value;
    const emailError  = document.getElementById('err-email');
    const passError   = document.getElementById('err-password');
  
    // Reset thông báo cũ
    emailError.textContent = '';
    passError.textContent  = '';
  
    let hasError = false;
  
    // ===== 1. Kiểm tra rỗng =====
    if (!email) {
      emailError.textContent = 'Email is required.';
      hasError = true;
    }
    if (!password) {
      passError.textContent = 'Password is required.';
      hasError = true;
    }
    if (hasError) return;
  
    // ===== 2. Lấy danh sách user đã đăng ký =====
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user  = users.find(u => u.email === email);
  
    // ===== 3. Email tồn tại? =====
    if (!user) {
      emailError.textContent = 'Email not found.';
      return;
    }
  
    // ===== 4. Password đúng? =====
    if (user.password !== password) {
      passError.textContent = 'Incorrect password.';
      return;
    }
  
    // ===== 5. Đăng nhập thành công =====
    alert('Login successful!');
    console.log('✅ Logged in as:', user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = '../index.html';
  }
  