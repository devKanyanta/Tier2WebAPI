// Firebase Configuration (Replace with your own)
const firebaseConfig = {
    apiKey: "AIzaSyBl7SerVRiwhS6Krg_6l4K1raQzB8k-5kw",
    authDomain: "evotrack-ff16b.firebaseapp.com",
    databaseURL: "https://evotrack-ff16b-default-rtdb.firebaseio.com",
    projectId: "evotrack-ff16b",
    storageBucket: "evotrack-ff16b.firebasestorage.app",
    messagingSenderId: "741773100125",
    appId: "1:741773100125:web:b930a49125d75104f439b4",
    measurementId: "G-HCD2LCXEBQ"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Sign in with Firebase
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Check email verification
        if (!user.emailVerified) {
            alert('Please verify your email before logging in.');
            await auth.signOut();
            return;
        }

        // Remember me functionality
        if (rememberMeCheckbox.checked) {
            // Set persistence to LOCAL (stays logged in between browser sessions)
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        } else {
            // Set persistence to SESSION (logged in only in current tab)
            await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }

        // Redirect to dashboard
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Login Error:', error);
        
        // Specific error handling
        switch(error.code) {
            case 'auth/wrong-password':
                alert('Incorrect password. Please try again.');
                break;
            case 'auth/user-not-found':
                alert('No account found with this email. Please sign up.');
                break;
            case 'auth/too-many-requests':
                alert('Too many login attempts. Please try again later.');
                break;
            default:
                alert('Login failed: ' + error.message);
        }
    }
});
