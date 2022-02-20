const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const key = require('../../account.json');
const firebaseConfig = {
    apiKey: "AIzaSyCK8_KnJ0OChI1EbRdojDc4L9aMxw8mBJE",
    authDomain: "yes-fitness-f2c41.firebaseapp.com",
    projectId: "yes-fitness-f2c41",
    storageBucket: "yes-fitness-f2c41.appspot.com",
    messagingSenderId: "773942840110",
    appId: "1:773942840110:web:e9a430d3537fedfb5708bf"
  };
initializeApp({
    credential:cert(firebaseConfig)
});
const db = getFirestore();
module.exports = db;