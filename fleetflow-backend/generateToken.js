const admin = require('./src/config/firebase');
const axios = require('axios');

// Replace with your Firebase Web API Key
// You can find this in Project Settings > General > Web API Key
const API_KEY = "AIzaSyCaw9YBA2rEK9rLjVcX9cMVHIvcHGQk1aY"; 

async function getIdToken() {
  try {
    // 1. Create a Custom Token using Admin SDK
    const uid = 'test-user-manager';
    const customToken = await admin.auth().createCustomToken(uid, { role: 'MANAGER' });
    
    // 2. Exchange Custom Token for ID Token using Firebase Auth REST API
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${API_KEY}`,
      {
        token: customToken,
        returnSecureToken: true
      }
    );

    const idToken = response.data.idToken;
    console.log("\nCopy this ID Token into Postman Authorization Header (Bearer <token>):\n");
    console.log(idToken);
    console.log("\n");
  } catch (error) {
    console.error('Error generating token:', error.response ? error.response.data : error.message);
  }
}

getIdToken();
