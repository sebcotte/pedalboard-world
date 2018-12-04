import firebase from '../firebase.js';

export default function isUserLogged() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            return true
        } else {
            return false
        }
    });
}