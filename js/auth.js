// Google ile kimlik doğrulama (giriş/kayıt)
async function handleGoogleAuth(isRegistration = false) {
    try {
        // Google sign-in provider oluştur
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // Google popup ile giriş
        const result = await firebase.auth().signInWithPopup(provider);
        
        // Google credential'ı al
        const credential = result.credential;
        
        // Server'a gönder
        const response = await fetch('/google-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                credential: credential.idToken,
                isRegistration: isRegistration
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Modal'ı kapat
            const activeModal = document.querySelector('.modal:not([style*="display: none"])');
            if (activeModal) {
                activeModal.querySelector('.modal-close').click();
            }

            // Kullanıcıyı karşılama
            const action = isRegistration ? 'Kaydınız' : 'Girişiniz';
            alert(`${action} başarılı! Hoş geldiniz, ${data.user.name}!`);
            
            // Ana sayfaya yönlendir
            window.location.href = '/';
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Google auth hatası:', error);
        alert(error.message || 'Google ile işlem yapılırken bir hata oluştu.');
    }
}

// Form işleyicileri
document.addEventListener('DOMContentLoaded', function() {
    // Register form submit handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Form verileri
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
            const terms = document.getElementById('terms').checked;

            // Validation
            if (!name || !email || !password || !passwordConfirm) {
                alert('Lütfen tüm alanları doldurun.');
                return;
            }

            if (password !== passwordConfirm) {
                alert('Şifreler eşleşmiyor.');
                return;
            }

            if (!terms) {
                alert('Lütfen kullanım koşullarını kabul edin.');
                return;
            }

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Başarılı kayıt
                    alert('Kayıt başarılı! Giriş yapabilirsiniz.');
                    document.querySelector('.modal-close').click(); // Modal'ı kapat
                    // İsteğe bağlı: Direkt giriş modalını aç
                    // document.getElementById('showLogin').click();
                } else {
                    // Hata durumu
                    alert(data.error || 'Kayıt sırasında bir hata oluştu.');
                }
            } catch (error) {
                console.error('Kayıt hatası:', error);
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        });
    }

    // Login form submit handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Form verileri
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Validation
            if (!email || !password) {
                alert('Lütfen e-posta ve şifrenizi girin.');
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        rememberMe
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Başarılı giriş
                    if (rememberMe) {
                        // Kullanıcı bilgilerini localStorage'a kaydet
                        localStorage.setItem('userEmail', email);
                    }
                    
                    // Modal'ı kapat
                    document.querySelector('#loginModal .modal-close').click();
                    
                    // Kullanıcıyı karşılama
                    alert('Hoş geldiniz!');
                    
                    // Sayfayı yenile veya ana sayfaya yönlendir
                    window.location.href = '/';
                } else {
                    // Hata durumu
                    alert(data.error || 'Giriş yapılırken bir hata oluştu.');
                }
            } catch (error) {
                console.error('Giriş hatası:', error);
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        });
    }

    // Login modal'daki Google butonu
    const loginGoogleBtn = document.querySelector('#loginModal .social-button');
    if (loginGoogleBtn) {
        loginGoogleBtn.addEventListener('click', () => handleGoogleAuth(false));
    }

    // Register modal'daki Google butonu
    const registerGoogleBtn = document.querySelector('#registerModal .social-button');
    if (registerGoogleBtn) {
        registerGoogleBtn.addEventListener('click', () => handleGoogleAuth(true));
    }
});
