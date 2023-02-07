// const firebase = require("firebase-admin");
// const serviceAccount = require("../secretFirebase.json");

// // Initialize the Firebase Admin SDK
// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://wca-clone.firebaseio.com"
// });

// // Function to generate FCM token
// const generateFCMToken = async () => {
//   try {
//     const token = await firebase.messaging().getToken();
//     console.log("FCM Token: ", token);
//     return token;
//   } catch (error) {
//     console.error("Error generating FCM token: ", error);
//   }
// };

// // Call the function to generate FCM token
// module.exports = generateFCMToken;