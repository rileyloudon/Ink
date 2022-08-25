import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAXsxLt1-ebKHlUr_8w0mCLTe6w921K3V8',
  authDomain: 'ink-ink.firebaseapp.com',
  projectId: 'ink-ink',
  storageBucket: 'ink-ink.appspot.com',
  messagingSenderId: '420414494355',
  appId: '1:420414494355:web:08c7a26f275859976b9f66',
};

initializeApp(firebaseConfig);

Cypress.Commands.add('login', (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
});
