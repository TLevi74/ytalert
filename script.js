import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBkU9Whyc4w4bBlmMnLawxGgv0Qb-EPlRo",
    authDomain: "ytalert-30c0b.firebaseapp.com",
    projectId: "ytalert-30c0b",
    storageBucket: "ytalert-30c0b.firebasestorage.app",
    messagingSenderId: "756995013574",
    appId: "1:756995013574:web:41fac727e9bfe39918d0c7"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    //signup form
    const submit = document.getElementById("submit");
    if (submit) {
        submit.addEventListener("click", function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const displayName = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            createUserWithEmailAndPassword(auth, email, password, displayName)
                .then((userCredential) => {
                    const user = userCredential.user;
                    localStorage.setItem("user", JSON.stringify({
                        email: user.email,
                        uid: user.uid,
                        displayName: username
                    }));
                    setDoc(doc(db, "users", user.uid), {
                        email: user.email,
                        uid: user.uid,
                        displayName: username
                    })
                        .then(() => {
                            window.location.href = "profile.html";
                        })
                        .catch((error) => {
                            alert("Error: " + error.message);
                        });
                })
                .catch((error) => {
                    alert("Error: " + error.message);
                });
        });
    }

    //login form
    const login = document.getElementById("login");
    if (login) {
        login.addEventListener("click", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    localStorage.setItem("user", JSON.stringify({
                        email: user.email,
                        uid: user.uid,
                        displayName: user.displayName || "User"
                    }));
                    window.location.href = "profile.html";
                })
                .catch((error) => {
                    alert("Error: " + error.message);
                });
        });
    }
    //logout
    const logout = document.getElementById("logout");
    if (logout) {
        logout.addEventListener("click", function (event) {
            event.preventDefault();
            auth.signOut()
                .then(() => {
                    localStorage.removeItem("user");
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    alert("Error: " + error.message);
                });
        });
    }

    // Populate profile page
    const profileHeader = document.querySelector("h1");
    if (profileHeader && window.location.pathname.includes("profile.html")) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            profileHeader.textContent = `Welcome, ${user.displayName}!`;
        } else {
            window.location.href = "index.html";
        }
    }
});