const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const key = require('../../account.json');
initializeApp({
    credential:cert(key)
});
const db = getFirestore();
module.exports = db;