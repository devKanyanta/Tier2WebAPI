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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}
const auth = firebase.auth();
const firestore = firebase.firestore();

// DOM Elements
const welcomeMessage = document.getElementById('welcomeMessage');
const apiKeyElement = document.getElementById('apiKey');
const copyApiKeyBtn = document.getElementById('copyApiKey');
const logoutBtn = document.getElementById('logoutBtn');
const totalCallsElement = document.getElementById('totalCalls');
const remainingQuotaElement = document.getElementById('remainingQuota');
const paymentSection = document.getElementById('paymentSection');
const apiSection = document.getElementById('apiSection');
const docsSection = document.getElementById('docsSection');
const docsIframe = document.getElementById('docsIframe');
const restApiDocsLink = document.getElementById('rest-api-docs');

// Add Event Listener to the "REST API Docs" link
restApiDocsLink.addEventListener('click', () => {
    // Show the documentation section
    docsSection.classList.remove('hidden');

    // Set the src of the iframe to load the documentation website
    loadDocumentation();
});

// Function to load the documentation (by setting the iframe src)
function loadDocumentation() {
    // Set the URL of the REST API documentation website
    docsIframe.src = 'https://documenter.getpostman.com/view/40134463/2sAYBYfqEf'; // Replace with the actual URL of your documentation

    // Optional: You can also handle loading states or errors here if you like
    docsIframe.onload = function() {
        console.log('Documentation loaded successfully.');
    };

    docsIframe.onerror = function() {
        console.error('Failed to load documentation.');
        docsIframe.src = ''; // Clear iframe if there is an error
        docsSection.innerHTML = '<p class="text-red-500">Failed to load documentation. Please try again later.</p>';
    };
}

// Authentication State Listener
auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const userDoc = await firestore.collection('users').doc(user.uid).get();
            const userData = userDoc.data();

            welcomeMessage.textContent = `Welcome, ${userData.fullName || user.email}`;

            if (!userData.isPaid) {
                paymentSection.classList.remove('hidden');
                apiSection.classList.add('hidden');

                loadPayPalScript(() => initializePayPal(user));
            } else {
                paymentSection.classList.add('hidden');
                apiSection.classList.remove('hidden');

                if (!userData.apiKey) {
                    const newApiKey = generateAPIKey();
                    await firestore.collection('users').doc(user.uid).update({
                        apiKey: newApiKey,
                        apiAccess: true
                    });
                    apiKeyElement.textContent = newApiKey;
                } else {
                    apiKeyElement.textContent = userData.apiKey;
                }

                totalCallsElement.textContent = userData.totalAPICalls || 0;
                remainingQuotaElement.textContent = 'Unlimited';
            }
        } catch (error) {
            console.error('Dashboard Error:', error);
            alert('Error loading user data.');
        }
    } else {
        window.location.href = 'index.html';
    }
});

// PayPal Integration
function loadPayPalScript(callback) {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AcoXOF5SWBfRE731d8GtCmobX9kczUpHeH6elqK8vpztPyaL93iFd4W2LNlAESpUIEXJiml1NW76a-uQ';
    script.onload = callback;
    script.onerror = () => console.error('PayPal SDK failed to load.');
    document.head.appendChild(script);
}

function initializePayPal(user) {
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: "API Access Plan",
                    amount: {
                        currency_code: "USD",
                        value: "59.99"
                    }
                }]
            });
        },
        onApprove: async function (data, actions) {
            try {
                const details = await actions.order.capture();
                await firestore.collection('users').doc(user.uid).update({
                    isPaid: true,
                    paymentDate: firebase.firestore.FieldValue.serverTimestamp(),
                    planType: 'paid'
                });
                alert('Payment successful! Full API access unlocked.');
                window.location.reload();
            } catch (error) {
                console.error('Payment capture error:', error);
                alert('Payment failed, please try again.');
            }
        }
    }).render('#paypal-button-container');
}

// Generate API Key Function
function generateAPIKey() {
    return 'API-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Load Documentation in a New Tab
restApiDocsLink.addEventListener('click', () => {
    window.open('https://documenter.getpostman.com/', '_blank'); // Opens docs in a new tab
});


// Copy API Key Function
copyApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyElement.textContent;
    navigator.clipboard.writeText(apiKey)
        .then(() => {
            alert('API Key copied to clipboard!');
        })
        .catch((error) => {
            console.error('Error copying API Key:', error);
            alert('Failed to copy API Key.');
        });
});

// Logout Function
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Logout Error:', error);
        alert('Failed to log out.');
    });
});
