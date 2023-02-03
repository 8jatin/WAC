// Import the functions you need from the SDKs you need
// const admin = require("firebase-admin");
// const dbConfig = require('./db.config');

// const pathToServiceAccount = require("../wca-clone-firebase-adminsdk-og6qj-c9a8200ba0.json");

// admin.initializeApp({
//   credential: admin.credential.cert({
//     type:pathToServiceAccount.type,
//     projectId: pathToServiceAccount.project_id,
//     clientEmail: pathToServiceAccount.client_email,
//     clientId:pathToServiceAccount.client_id,
//     privateKey: pathToServiceAccount.private_key,
//     privateKeyId:pathToServiceAccount.private_key_id,
//     authUri:pathToServiceAccount.auth_uri,
//     tokenUri:pathToServiceAccount.token_uri,
//     authProviderX509:pathToServiceAccount.auth_provider_x509_cert_url,
//     clientProviderX509:pathToServiceAccount.client_x509_cert_url
//   }),
//   databaseURL: `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
// });


// exports.sendPushNotification = async(token, message)=>{
//     try {
//       const payload = {
//         notification: {
//           title: "New notification",
//           body: message,
//           sound: "default"
//         }
//       };
  
//       const response = await admin.messaging().sendToDevice(token, payload);
//       console.log("Notification sent successfully:", response);
//     } catch (error) {
//       console.error("Error sending notification:", error);
//     }
//   }
  // Import the functions you need from the SDKs you need
// const { initializeApp } = require("firebase/app");
// // const { getMessaging, getToken } = require("firebase/messaging");


// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBlyoxm4kvb5VMJ5hDq15YPzetd_XEY1zw",
//   authDomain: "wca-clone.firebaseapp.com",
//   projectId: "wca-clone",
//   storageBucket: "wca-clone.appspot.com",
//   messagingSenderId: "205492316651",
//   appId: "1:205492316651:web:3be90af6368435e9b151ae",
//   measurementId: "G-5Q4RMB675N"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// // const messaging = getMessaging(firebaseApp);


// function requestPermission() {
//     console.log("Requesting permission...");
//     Notification.requestPermission().then((permission) => {
//         if (permission === "granted") {
//             console.log("Notification permission granted.");
//         }
//     });
// }


// getToken(messaging,{vapidKey:"BNwzimWNaeRPTCANeDhzLCAsnNITBNcrqAVB87NLRnC0F9lneiPTn02HZvl6Nuh_xldanVXQ1t2CjIddUb8OxX8"}).then((currentToken) => {
//     if (currentToken) {
//       console.log('-------------',currentToken);
//     } else {
//       // Show permission request UI
//       console.log('No registration token available. Request permission to generate one.');
//       // ...
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // ...
//   });

const { CourierClient } = require("@trycourier/courier");

const courier = CourierClient({ authorizationToken: "pk_prod_F9VTXNY7CEMFXHMGDPSEWJPP6XEE" });

const { requestId } = await courier.send({
    message: {
      to: {
        firebaseToken:
          "MTI2MjAwMzQ3OTMzQHByb2plY3RzLmdjbS5hbmFTeUIzcmNaTmtmbnFLZEZiOW1oekNCaVlwT1JEQTJKV1d0dw==",
      },
      template: "J8V5PBWQ284XZFJ39R62TNRJDJ7G",
      data: {
        recipientName: "jatin",
      },
    },
  });