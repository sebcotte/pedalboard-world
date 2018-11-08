import firebase from 'firebase';
var config = {
    apiKey: "AIzaSyC8abc5XODSRzj9s3doQShEqOxersZC_Jc",
    authDomain: "pedalboard-world.firebaseapp.com",
    databaseURL: "https://pedalboard-world.firebaseio.com",
    projectId: "pedalboard-world",
    storageBucket: "pedalboard-world.appspot.com",
    messagingSenderId: "392159278554"
};
firebase.initializeApp(config);
export default firebase;
