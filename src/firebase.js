import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyCw9Fk79cJKUV09HiYZhJiwHp_NCLrxGR8",    
    authDomain: "pedalboard-js.firebaseapp.com",
    databaseURL: "https://pedalboard-js.firebaseio.com",
    projectId: "pedalboard-js",
    storageBucket: "pedalboard-js.appspot.com",
    messagingSenderId: "331625343407"
};
firebase.initializeApp(config);
export default firebase;