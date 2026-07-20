<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDbP02UP_mibIerDzVoeQFdXge6hu6ZfJM",
    authDomain: "engaijaapp.firebaseapp.com",
    projectId: "engaijaapp",
    storageBucket: "engaijaapp.firebasestorage.app",
    messagingSenderId: "920214637404",
    appId: "1:920214637404:web:46c6206ab1a2fe4fe88f99",
    measurementId: "G-D1BQ4N7F49"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>