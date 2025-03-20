const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Statik dosyaları serve et
app.use(express.static(path.join(__dirname)));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/html', express.static(path.join(__dirname, 'html')));

// Dinamik sayfa yönlendirmeleri
const pages = {
    '/': 'MainPage.html',
    '/about': 'about.html',
    '/contact': 'contact.html'
};

// Dinamik route handler
Object.entries(pages).forEach(([route, page]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'html', page));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ana sayfaya erişmek için: http://localhost:${PORT}`);
});
