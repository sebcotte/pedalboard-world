import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyAI0LPOPXo_IMwGiOR4s4MQ6v3tI5Rksi0",
    authDomain: "pedalbaord-world.firebaseapp.com",
    databaseURL: "https://pedalbaord-world.firebaseio.com",
    projectId: "pedalbaord-world",
    storageBucket: "pedalbaord-world.appspot.com",
    messagingSenderId: "723773692171"
};
firebase.initializeApp(config);
export default firebase;