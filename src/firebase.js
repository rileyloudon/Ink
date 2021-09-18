import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAXsxLt1-ebKHlUr_8w0mCLTe6w921K3V8',
  authDomain: 'ink-ink.firebaseapp.com',
  projectId: 'ink-ink',
  storageBucket: 'ink-ink.appspot.com',
  messagingSenderId: '420414494355',
  appId: '1:420414494355:web:08c7a26f275859976b9f66',
};

initializeApp(firebaseConfig);

export const registerUser = (email, password, username, fullName) => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: `https://source.boringavatars.com/beam/150/${username}?colors=2D1B33,F36A71,EE887A,E4E391,9ABC8A`,
      }).then(() => {
        // Need to create user file in firestore, save fullName and other settings there.
        console.log(fullName);
        return userCredential;
      });
    })
    .catch((err) => console.log(err));
};

export const signInUser = (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => userCredential)
    .catch((err) => console.log(err));
};
