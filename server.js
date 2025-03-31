const express = require('express');
const path = require('path');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

// Firebase yapılandırması
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
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // JSON verilerini almak için

// 📌 Kullanıcı Kayıt Olma (Sign Up)
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "E-posta ve şifre gereklidir!" });
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        res.json({ success: true, message: "Kullanıcı başarıyla kaydedildi!", uid: userCredential.user.uid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 📌 Kullanıcı Giriş Yapma (Login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "E-posta ve şifre gereklidir!" });
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        res.json({ success: true, message: "Giriş başarılı!", uid: userCredential.user.uid });
    } catch (error) {
        res.status(401).json({ success: false, message: "Giriş başarısız: " + error.message });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
