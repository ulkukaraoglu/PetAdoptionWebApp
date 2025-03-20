document.addEventListener('DOMContentLoaded', function() {
    // Modal HTML dosyalarını dinamik olarak yükle
    const modalTypes = ['login', 'register'];
    
    Promise.all(
        modalTypes.map(type => 
            fetch(`/html/${type}Modal.html`)
                .then(response => response.text())
                .then(html => ({ type, html }))
        )
    )
    .then(modals => {
        modals.forEach(({ type, html }) => {
            document.body.insertAdjacentHTML('beforeend', html);
        });
        initializeModals();
        setupFormHandlers();
    })
    .catch(error => console.error('Error loading modals:', error));
});

function initializeModals() {
    const modalConfig = {
        login: {
            buttonId: 'loginBtn',
            modalId: 'loginModal'
        },
        register: {
            buttonId: 'registerBtn',
            modalId: 'registerModal'
        }
    };

    // Modal elementlerini hazırla
    const modals = {};
    const buttons = {};
    
    Object.entries(modalConfig).forEach(([type, config]) => {
        modals[type] = document.getElementById(config.modalId);
        buttons[type] = document.getElementById(config.buttonId);
    });

    // Modal açma işleyicilerini ekle
    Object.entries(buttons).forEach(([type, button]) => {
        if (button) {
            button.addEventListener('click', () => showModal(modals[type]));
        }
    });

    // Kapatma düğmelerini ayarla
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            hideModal(modal);
        });
    });

    // Modal dışına tıklama
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            hideModal(event.target);
        }
    });

    // Modal geçişlerini ayarla
    setupModalTransitions(modals.login, modals.register);
}

function showModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function hideModal(modal) {
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function setupModalTransitions(loginModal, registerModal) {
    const transitions = {
        'showRegister': {
            from: loginModal,
            to: registerModal
        },
        'showLogin': {
            from: registerModal,
            to: loginModal
        }
    };

    Object.entries(transitions).forEach(([id, { from, to }]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                hideModal(from);
                setTimeout(() => showModal(to), 300);
            });
        }
    });
}

function setupFormHandlers() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            // Burada normalde API'ye istek atılacak
            // Şimdilik demo amaçlı direkt giriş yapıyoruz
            const mockUserData = {
                name: email.split('@')[0],
                email: email,
                avatar: '../images/default-avatar.png'
            };
            
            login(mockUserData);
            hideModal(document.getElementById('loginModal'));
        });
    }

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;
            const name = registerForm.querySelector('input[name="name"]') ? 
                          registerForm.querySelector('input[name="name"]').value : 
                          registerForm.querySelector('#registerName').value;
            
            // Burada normalde API'ye istek atılacak
            // Şimdilik demo amaçlı direkt giriş yapıyoruz
            const mockUserData = {
                name: name,
                email: email,
                avatar: '../images/default-avatar.png'
            };
            
            login(mockUserData);
            hideModal(document.getElementById('registerModal'));
        });
    }
}
