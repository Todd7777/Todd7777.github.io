document.addEventListener('DOMContentLoaded', function() {
    // Demo credentials
    const DEMO_CREDENTIALS = {
        email: 'demo@example.com',
        password: 'demo123'
    };

    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
                sessionStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid credentials. Please use the demo credentials shown below.');
            }
        });
    }

    // Logout handling
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }

    // Protect authenticated pages
    if (!isLoggedIn && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
});
