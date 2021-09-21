import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
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
    .catch((err) => {
      // Add an error if username is taken
      switch (err.code) {
        case 'auth/email-already-in-use':
          return `Another account is using ${email}.`;
        case 'auth/invalid-email':
          return 'Enter a valid email address.';
        case 'auth/weak-password':
          return 'Please enter a stonger password.';
        default:
          return 'Error';
      }
    });
};

export const signInUser = (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => userCredential)
    .catch((err) => {
      switch (err.code) {
        case 'auth/invalid-email':
          return 'Enter a valid email address.';
        case 'auth/user-not-found':
          return "The email you entered doesn't belong to an account.";
        case 'auth/wrong-password':
          return 'Sorry, your password was incorrect. Please double-check your password.';
        default:
          return 'Error';
      }
    });
};

export const signOutUser = () => {
  const auth = getAuth();
  signOut(auth);
};
