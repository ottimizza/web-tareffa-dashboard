importScripts('https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.10.0/firebase-messaging.js');
firebase.initializeApp({
  apiKey: 'AIzaSyAPjrzkQyjYwq0eXRavaA9LS_rrt9p5XgE',
  authDomain: 'portal-4c1f7.firebaseapp.com',
  databaseURL: 'https://portal-4c1f7.firebaseio.com',
  projectId: 'portal-4c1f7',
  storageBucket: 'portal-4c1f7.appspot.com',
  messagingSenderId: '92294481127',
  appId: '1:92294481127:web:97256da8c44df6c0b48e42',
  measurementId: 'G-ZLXKYRNY7Z'
});
const messaging = firebase.messaging();
