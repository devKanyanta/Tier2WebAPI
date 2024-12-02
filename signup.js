// Firebase Configuration
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
const firestore = firebase.firestore();

// DOM Elements
const signupForm = document.getElementById('signupForm');

// Signup Form Submission
signupForm.addEventListener('submit', async (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Disable submit button to prevent multiple submissions
    const submitButton = signupForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Creating Account...';

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const company = document.getElementById('company').value.trim();
    const useCase = document.getElementById('useCase').value;

    // Validation
    if (!fullName) {
        alert('Please enter your full name');
        resetSubmitButton(submitButton);
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        resetSubmitButton(submitButton);
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long!');
        resetSubmitButton(submitButton);
        return;
    }

    try {
        // Create user in Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await firestore.collection('users').doc(user.uid).set({
            fullName: fullName,
            email: email,
            company: company || 'Not Specified',
            useCase: useCase || 'Not Specified',
            apiAccess: false,
            apiKey: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            totalAPICalls: 0,
            planType: 'free'
        });

        // Send verification email
        await user.sendEmailVerification();

        // Redirect to dashboard
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Signup Error:', error);

        // Detailed error handling
        let errorMessage = 'Signup failed. ';
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email is already registered.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage += 'Email/password accounts are not enabled.';
                break;
            default:
                errorMessage += error.message;
        }

        alert(errorMessage);
        resetSubmitButton(submitButton);
    }
});

// Helper function to reset submit button
function resetSubmitButton(button) {
    button.disabled = false;
    button.textContent = 'Create Account';
}

// Optional: Add real-time validation
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);

function validateEmail(e) {
    const emailInput = e.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailInput.value)) {
        emailInput.setCustomValidity('Please enter a valid email address');
    } else {
        emailInput.setCustomValidity('');
    }
}

function validatePassword(e) {
    const passwordInput = e.target;
    
    if (passwordInput.value.length < 8) {
        passwordInput.setCustomValidity('Password must be at least 8 characters long');
    } else {
        passwordInput.setCustomValidity('');
    }
}