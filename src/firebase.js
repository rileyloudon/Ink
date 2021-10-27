import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAXsxLt1-ebKHlUr_8w0mCLTe6w921K3V8',
  authDomain: 'ink-ink.firebaseapp.com',
  projectId: 'ink-ink',
  storageBucket: 'ink-ink.appspot.com',
  messagingSenderId: '420414494355',
  appId: '1:420414494355:web:08c7a26f275859976b9f66',
};

initializeApp(firebaseConfig);
const db = getFirestore();

export const registerUser = async (email, password, tempUsername, fullName) => {
  const username = tempUsername.toLowerCase();
  const docRef = doc(db, 'users', username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) return 'A user with that username already exists.';

  const auth = getAuth();

  // Need to fix: user gets signed in right after being created,
  // doesn't get their profile picture in time for header render

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((err) => {
    switch (err.code) {
      case 'auth/email-already-in-use':
        return `A user with that email already exists.`;
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/weak-password':
        return 'Please enter a stonger password.';
      default:
        return 'Error';
    }
  });

  await updateProfile(auth.currentUser, {
    displayName: username,
    photoURL: `https://source.boringavatars.com/beam/150/${username}?colors=2D1B33,F36A71,EE887A,E4E391,9ABC8A`,
  }).catch((err) => {
    return `Error updating profile, ${err}`;
  });

  await setDoc(doc(db, 'users', username), {
    username,
    photoURL: `https://source.boringavatars.com/beam/150/${username}?colors=2D1B33,F36A71,EE887A,E4E391,9ABC8A`,
    fullName,
    posts: [],
    followers: [],
    following: [],
    bio: '',
  }).catch((err) => {
    return `Error updating profile, ${err}`;
  });

  await auth.currentUser.reload();

  return credential;
};

export const signInUser = async (email, password) => {
  const auth = getAuth();

  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((err) => {
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
  return credential;
};

export const signOutUser = async () => {
  const auth = getAuth();
  await signOut(auth).catch((err) => `Error signing out, ${err}`);
};

export const fetchUserData = async (username) => {
  const docRef = doc(db, 'users', username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return 'User not found';
};

export const followUser = async (userToFollow) => {
  const auth = getAuth();

  const me = doc(db, 'users', auth.currentUser.displayName);
  const otherUser = doc(db, 'users', userToFollow);

  await updateDoc(me, {
    following: arrayUnion(userToFollow),
  });

  await updateDoc(otherUser, {
    followers: arrayUnion(auth.currentUser.displayName),
  });

  const docSnap = await getDoc(doc(db, 'users', userToFollow));
  return docSnap.data();
};

export const unfollowUser = async (userToUnfollow) => {
  const auth = getAuth();

  const me = doc(db, 'users', auth.currentUser.displayName);
  const otherUser = doc(db, 'users', userToUnfollow);

  await updateDoc(me, {
    following: arrayRemove(userToUnfollow),
  });

  await updateDoc(otherUser, {
    followers: arrayRemove(auth.currentUser.displayName),
  });

  const docSnap = await getDoc(doc(db, 'users', userToUnfollow));
  return docSnap.data();
};

export const savePost = async (image, caption, disableComments) => {
  try {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `${getAuth().currentUser.displayName}/${image.properties.name}`
    );

    const upload = await uploadBytes(storageRef, image.properties);

    const publicImageUrl = await getDownloadURL(storageRef);

    const docRef = await doc(db, 'users', getAuth().currentUser.displayName);
    return await updateDoc(docRef, {
      posts: arrayUnion({
        imageUrl: publicImageUrl,
        caption,
        disableComments,
        storageUrl: upload.metadata.fullPath,
        timestamp: Timestamp.now(),
      }),
    });
  } catch (err) {
    return `There was an error uploading this post, ${err}`;
  }
};
