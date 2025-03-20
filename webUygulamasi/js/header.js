// Tüm sayfalarda tutarlı header görünümü sağlamak için ortak header işlevleri

document.addEventListener('DOMContentLoaded', function() {
    // Header'ı yükle
    fetch('/html/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            initializeHeaderScroll();
            updateActiveNavLink();
            
            // Modal JS yüklendikten sonra auth.js'in çalışması için
            const authScript = document.createElement('script');
            authScript.src = '/js/auth.js';
            document.body.appendChild(authScript);
        })
        .catch(error => console.error('Header yüklenirken hata oluştu:', error));
});

// Header scroll efekti
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    
    // Sayfa ilk yüklendiğinde scroll pozisyonunu kontrol et
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Aktif sayfa linkini güncelle
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        
        if (currentPath === linkPath ||
            (currentPath.includes(linkPath) && linkPath !== '/') ||
            (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        }
    });
}
