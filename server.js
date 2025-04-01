const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } = require("firebase/auth");
const { getFirestore, collection, addDoc, query, where, getDocs } = require("firebase/firestore");

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
    try {
        const { name, email, password } = req.body;

        // Firebase Authentication ile kullanıcı oluştur
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Firestore'a kullanıcı bilgilerini kaydet
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name: name,
            email: email,
            createdAt: new Date().toISOString()
        });

        res.status(200).json({ message: 'Kayıt başarılı', userId: user.uid });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(400).json({ 
            error: error.code === 'auth/email-already-in-use' 
                ? 'Bu e-posta adresi zaten kullanılıyor.' 
                : 'Kayıt sırasında bir hata oluştu.'
        });
    }
});

// Kullanıcı Giriş (E-posta/Şifre)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Firebase Authentication ile giriş yap
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Firestore'dan kullanıcı bilgilerini al
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        let userData = null;
        querySnapshot.forEach((doc) => {
            userData = doc.data();
        });

        res.status(200).json({ 
            message: 'Giriş başarılı',
            user: {
                uid: user.uid,
                email: user.email,
                name: userData?.name || ''
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(400).json({ 
            error: error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
                ? 'E-posta veya şifre hatalı.'
                : 'Giriş yapılırken bir hata oluştu.'
        });
    }
});

// Google ile Kayıt/Giriş
app.post('/google-auth', async (req, res) => {
    try {
        const { credential, isRegistration } = req.body;
        
        // Google credential'ı ile giriş yap
        const googleCredential = GoogleAuthProvider.credential(credential);
        const userCredential = await signInWithCredential(auth, googleCredential);
        const user = userCredential.user;

        // Kullanıcı Firestore'da var mı kontrol et
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            if (!isRegistration) {
                // Kullanıcı giriş yapmaya çalışıyor ama kayıtlı değil
                throw new Error('NOT_REGISTERED');
            }

            // Yeni kullanıcıyı Firestore'a kaydet
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                registrationMethod: 'google'
            });

            res.status(200).json({
                message: 'Google ile kayıt başarılı',
                user: {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photoURL: user.photoURL
                }
            });
        } else {
            if (isRegistration) {
                // Kullanıcı kayıt olmaya çalışıyor ama zaten kayıtlı
                throw new Error('ALREADY_REGISTERED');
            }

            // Mevcut kullanıcı girişi
            res.status(200).json({
                message: 'Google ile giriş başarılı',
                user: {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photoURL: user.photoURL
                }
            });
        }
    } catch (error) {
        console.error('Google auth hatası:', error);
        
        if (error.message === 'NOT_REGISTERED') {
            res.status(400).json({
                error: 'Bu Google hesabı ile kayıtlı kullanıcı bulunamadı. Lütfen önce kayıt olun.'
            });
        } else if (error.message === 'ALREADY_REGISTERED') {
            res.status(400).json({
                error: 'Bu Google hesabı zaten kayıtlı. Lütfen giriş yapın.'
            });
        } else {
            res.status(400).json({
                error: 'Google ile işlem yapılırken bir hata oluştu.'
            });
        }
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
