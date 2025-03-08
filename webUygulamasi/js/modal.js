document.addEventListener('DOMContentLoaded', function() {
    // Modalları yükle
    Promise.all([
        fetch('../html/loginModal.html').then(response => response.text()),
        fetch('../html/registerModal.html').then(response => response.text())
    ])
    .then(([loginHtml, registerHtml]) => {
        document.body.insertAdjacentHTML('beforeend', loginHtml);
        document.body.insertAdjacentHTML('beforeend', registerHtml);
        initializeModals();
    })
    .catch(error => console.error('Modallar yüklenirken hata oluştu:', error));
});

function initializeModals() {
    // Header yüklendikten sonra butonları seç
    const waitForHeader = setInterval(() => {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.querySelector('.register-btn');
        
        if (loginBtn && registerBtn) {
            clearInterval(waitForHeader);
            setupModalListeners(loginBtn, registerBtn);
        }
    }, 100);
}

function setupModalListeners(loginBtn, registerBtn) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginBtn = document.getElementById('closeModal');
    const closeRegisterBtn = document.getElementById('closeRegisterModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterBtn = document.getElementById('showRegisterModal');
    const showLoginBtn = document.getElementById('showLoginModal');

    function showModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function hideModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    // Login modal kontrolleri
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showModal(loginModal);
    });

    closeLoginBtn.addEventListener('click', function() {
        hideModal(loginModal);
    });

    // Register modal kontrolleri
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showModal(registerModal);
    });

    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal(loginModal);
        setTimeout(() => showModal(registerModal), 300);
    });

    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal(registerModal);
        setTimeout(() => showModal(loginModal), 300);
    });

    closeRegisterBtn.addEventListener('click', function() {
        hideModal(registerModal);
    });

    // Dışarı tıklandığında modalları kapat
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            hideModal(loginModal);
        }
        if (e.target === registerModal) {
            hideModal(registerModal);
        }
    });

    // Login form işlemleri
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Burada giriş işlemleri yapılacak
        console.log('Giriş denemesi:', { email });
        
        // Form temizleme
        loginForm.reset();
        hideModal(loginModal);
    });

    // Register form işlemleri
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        if (password !== passwordConfirm) {
            alert('Şifreler eşleşmiyor!');
            return;
        }
        
        // Burada kayıt işlemleri yapılacak
        console.log('Kayıt denemesi:', { name, email });
        
        // Form temizleme
        registerForm.reset();
        hideModal(registerModal);
    });
}
