importScripts('https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.10.0/firebase-messaging.js');
firebase.initializeApp({
  apiKey: 'AIzaSyC7ZtQvtdnsdO4wJwM4EXvY1dTSqZpOzZc',
  authDomain: 'tareffa-dashboard.firebaseapp.com',
  databaseURL: 'https://tareffa-dashboard.firebaseio.com',
  projectId: 'tareffa-dashboard',
  storageBucket: 'tareffa-dashboard.appspot.com',
  messagingSenderId: '419399937611',
  appId: '1:419399937611:web:25edea397ab43a33c427ce',
  measurementId: 'G-JCM3777XVR'
});
const messaging = firebase.messaging();
