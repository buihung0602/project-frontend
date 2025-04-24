function handleRegister() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Xoá hết thông báo lỗi cũ
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
  
    let hasError = false;
  
    // Kiểm tra rỗng
    if (!firstName) {
      document.getElementById('err-firstName').textContent = 'First name is required.';
      hasError = true;
    }
    if (!lastName) {
      document.getElementById('err-lastName').textContent = 'Last name is required.';
      hasError = true;
    }
    if (!email) {
      document.getElementById('err-email').textContent = 'Email is required.';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('err-email').textContent = 'Invalid email format.';
      hasError = true;
    }
  
    // Kiểm tra email trùng
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
      document.getElementById('err-email').textContent = 'Email already exists.';
      hasError = true;
    }
  
    // Kiểm tra độ mạnh mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password) {
      document.getElementById('err-password').textContent = 'Password is required.';
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      document.getElementById('err-password').textContent =
        'Password must have 8+ chars, uppercase, lowercase & number.';
      hasError = true;
    }
  
    // Kiểm tra xác nhận mật khẩu
    if (!confirmPassword) {
      document.getElementById('err-confirmPassword').textContent = 'Please confirm your password.';
      hasError = true;
    } else if (password !== confirmPassword) {
      document.getElementById('err-confirmPassword').textContent = 'Passwords do not match.';
      hasError = true;
    }
  
    if (hasError) return;
  
    // Lưu người dùng
    const newUser = { firstName, lastName, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
  
    alert('Registration successful!');
    window.location.href = '../html/login.html';
  }
  