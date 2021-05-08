require("dotenv").config({path:"../config/.env"})

const firebase =  require('firebase/app');
require("firebase/firestore");
require('firebase/auth');

const firebaseApp = firebase.initializeApp({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

module.exports = {
    db: db,
    auth: auth,
};


