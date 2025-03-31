document.addEventListener('DOMContentLoaded', function() {
    // Modalları yükle
    Promise.all([
        fetch('/html/loginModal.html').then(response => response.text()),
        fetch('/html/registerModal.html').then(response => response.text())
    ])
    .then(([loginHtml, registerHtml]) => {
        document.body.insertAdjacentHTML('beforeend', loginHtml);
        document.body.insertAdjacentHTML('beforeend', registerHtml);
        initializeModals();
    })
    .catch(error => console.error('Error loading modals:', error));
});

function initializeModals() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.querySelector('.register-btn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    // Modal kapatma düğmeleri
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Login butonu tıklama
    loginBtn?.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        loginModal.classList.add('show');
    });

    // Register butonu tıklama
    registerBtn?.addEventListener('click', () => {
        registerModal.style.display = 'flex';
        registerModal.classList.add('show');
    });

    // Header'daki kayıt ol butonu için event listener
    document.querySelector('.register-btn')?.addEventListener('click', () => {
        registerModal.style.display = 'flex';
        registerModal.classList.add('show');
    });

    // Kapatma düğmeleri için event listener
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    });

    // Modal dışına tıklayarak kapatma
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
            setTimeout(() => {
                event.target.style.display = 'none';
            }, 300);
        }
    });

    // Modal geçişleri
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    showRegisterLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('show');
        setTimeout(() => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
            registerModal.classList.add('show');
        }, 300);
    });

    showLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.classList.remove('show');
        setTimeout(() => {
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
            loginModal.classList.add('show');
        }, 300);
    });
}
