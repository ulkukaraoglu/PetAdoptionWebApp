const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Statik dosyaları serve et
app.use(express.static(path.join(__dirname)));

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'MainPage.html'));
});

// Hakkımızda sayfası
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'about.html'));
});

// İletişim sayfası
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'contact.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ana sayfaya erişmek için: http://localhost:${PORT}`);
});
