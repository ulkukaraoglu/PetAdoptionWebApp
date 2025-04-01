const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } = require("firebase/auth");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Statik dosyaları serve et
app.use(express.static(__dirname));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/html', express.static(path.join(__dirname, 'html')));

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyApVA0DWDNeYIsTm5IcwPVdIWJya6sTENU",
    authDomain: "petadoption-b33b9.firebaseapp.com",
    databaseURL: "https://petadoption-b33b9-default-rtdb.firebaseio.com",
    projectId: "petadoption-b33b9",
    storageBucket: "petadoption-b33b9.firebasestorage.app",
    messagingSenderId: "435395318116",
    appId: "1:435395318116:web:6e4c33947c6ef927eb2a71",
    measurementId: "G-9EWXZXDPSD"
};

// Firebase başlat
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'MainPage.html'));
});

// Hakkımızda sayfası yönlendirmesi
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'about.html'));
});

// İletişim sayfası yönlendirmesi
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'contact.html'));
});

// Kullanıcı Kayıt (E-posta/Şifre)
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        res.json({ success: true, message: "Kullanıcı başarıyla kaydedildi!", uid: userCredential.user.uid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Kullanıcı Giriş (E-posta/Şifre)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        res.json({ success: true, message: "Giriş başarılı!", uid: userCredential.user.uid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Google ile Giriş
app.post('/google-login', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ success: false, message: "ID Token gerekli!" });
    }

    const credential = GoogleAuthProvider.credential(idToken);

    try {
        const userCredential = await signInWithCredential(auth, credential);
        res.json({ success: true, message: "Google ile giriş başarılı!", uid: userCredential.user.uid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Kullanıcı ekleme API (Firestore’a yazma)
app.post('/add-user', async (req, res) => {
    const { isim, yas } = req.body;

    try {
        const docRef = await addDoc(collection(db, "kullanicilar"), { isim, yas });
        res.json({ success: true, message: "Kullanıcı eklendi!", id: docRef.id });
    } catch (error) {
        res.status(500).json({ success: false, message: "Hata: " + error.message });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ana sayfaya erişmek için: http://localhost:${PORT}`);
});
