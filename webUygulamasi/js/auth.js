// Auth durumunu kontrol et ve header'ı güncelle
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtons = document.getElementById('authButtons');
    const userDropdown = document.getElementById('userDropdown');
    const userName = localStorage.getItem('userName');
    const userAvatarUrl = localStorage.getItem('userAvatar');

    if (isLoggedIn && userName) {
        // Giriş yapılmış durumu
        if (authButtons) authButtons.style.display = 'none';
        if (userDropdown) {
            userDropdown.style.display = 'block';
            if (userAvatarUrl) {
                const avatarImg = userDropdown.querySelector('img');
                if (avatarImg) {
                    avatarImg.src = userAvatarUrl;
                    avatarImg.alt = userName;
                }
            }
        }
    } else {
        // Giriş yapılmamış durumu
        if (authButtons) authButtons.style.display = 'flex';
        if (userDropdown) userDropdown.style.display = 'none';
    }
}

// Kullanıcı girişi yap
function login(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userAvatar', userData.avatar || '../images/default-avatar.png');
    updateAuthUI();
}

// Çıkış yap
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    updateAuthUI();
    window.location.href = '/';
}

// Sayfa yüklendiğinde auth durumunu kontrol et
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    
    // Çıkış butonuna event listener ekle
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});
