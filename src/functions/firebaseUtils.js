import firebase from '../firebase.js';

export function connectedPage() {
    const subscription = firebase.auth().onAuthStateChanged((user)=>{
        if(!user) {
            window.location.replace("/login")
            return;
        }
        this.user=user
    });

    return subscription
}

export function visitorPage() {
    const subscription = firebase.auth().onAuthStateChanged((user)=>{
        if(user) {
            window.location.replace("/")
            return;
        }
        this.user = user
    });

    return subscription
}

export function getLoggedUser() {
    const user = firebase.auth().currentUser;
    if (user) return user
    return false
}