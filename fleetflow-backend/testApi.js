const admin = require('./src/config/firebase');
const axios = require('axios');

const API_KEY = "AIzaSyCaw9YBA2rEK9rLjVcX9cMVHIvcHGQk1aY"; 
const BACKEND_URL = "http://localhost:5005/api";

async function checkApi() {
  try {
    console.log("1. Generating Token...");
    const uid = 'test-user-manager';
    const customToken = await admin.auth().createCustomToken(uid, { role: 'MANAGER' });
    
    // Exchange for ID Token
    const authRes = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${API_KEY}`,
      { token: customToken, returnSecureToken: true }
    );
    const idToken = authRes.data.idToken;
    console.log("Token Generated successfully.");
    console.log("Token:", idToken);

    console.log("\n2. Testing /health...");
    try {
        const health = await axios.get('http://localhost:5005/health');
        console.log("Health Check:", health.data);
    } catch (e) {
        console.error("Health Check Failed:", e.message);
    }

    console.log("\n3. Testing GET /api/vehicles...");
    try {
        const vehicles = await axios.get(`${BACKEND_URL}/vehicles`, {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        console.log("Vehicles:", vehicles.data);
    } catch (e) {
        console.error("Vehicles Check Failed:", e.message, e.response?.data);
    }

  } catch (error) {
    console.error('Error:', error.message);
    if(error.response) console.error(error.response.data);
  }
}

checkApi();
