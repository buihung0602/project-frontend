// Check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../html/login.html';
        return false;
    }
    return true;
}

// Add click event listeners to navbar links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Skip the current active link
        if (!link.classList.contains('active')) {
            link.addEventListener('click', function(e) {
                if (!checkAuth()) {
                    e.preventDefault();
                }
            });
        }
    });
}); 