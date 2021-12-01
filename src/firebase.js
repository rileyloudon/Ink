import { v4 as uuidv4 } from 'uuid';
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
  // addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  collection,
  collectionGroup,
  where,
  query,
  orderBy,
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

  const collectionRef = collection(db, 'users', username, 'posts');
  const postsSnap = await getDocs(collectionRef);

  if (docSnap.exists()) {
    const posts = [];
    postsSnap.forEach((post) => posts.push(post.data()));
    return { header: docSnap.data(), posts };
  }
  return 'User not found';
};

// export const toggleFollowUser = async (userToInteract) => {
//   const auth = getAuth();

//   const me = doc(db, 'users', auth.currentUser.displayName);
//   const otherUser = doc(db, 'users', userToInteract);

//   const docSnap = await getDoc(doc(db, 'users', userToInteract));

//   if (!docSnap.data().followers.includes(auth.currentUser.displayName)) {
//     // Follow User
//     await updateDoc(me, {
//       following: arrayUnion(userToInteract),
//     });

//     await updateDoc(otherUser, {
//       followers: arrayUnion(auth.currentUser.displayName),
//     });
//   } else {
//     // Unfollow User
//     await updateDoc(me, {
//       following: arrayRemove(userToInteract),
//     });

//     await updateDoc(otherUser, {
//       followers: arrayRemove(auth.currentUser.displayName),
//     });
//   }
//   return docSnap.data();
// };

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

  const currentUser = doc(db, 'users', auth.currentUser.displayName);
  const otherUser = doc(db, 'users', userToUnfollow);

  await updateDoc(currentUser, {
    following: arrayRemove(userToUnfollow),
  });

  await updateDoc(otherUser, {
    followers: arrayRemove(auth.currentUser.displayName),
  });

  const docSnap = await getDoc(doc(db, 'users', userToUnfollow));
  return docSnap.data();
};

export const uploadNewPost = async (image, caption, disableComments) => {
  try {
    const auth = getAuth();
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `${getAuth().currentUser.displayName}/${image.properties.name}`
    );

    const upload = await uploadBytes(storageRef, image.properties);

    const publicImageUrl = await getDownloadURL(storageRef);

    const docRef = doc(
      collection(db, 'users', auth.currentUser.displayName, 'posts')
    );

    return await setDoc(docRef, {
      owner: auth.currentUser.displayName,
      imageUrl: publicImageUrl,
      caption,
      disableComments,
      likes: [],
      comments: [],
      storageUrl: upload.metadata.fullPath,
      id: docRef.id,
      timestamp: Timestamp.now(),
    });
  } catch (err) {
    return `There was an error uploading this post, ${err}`;
  }
};

export const fetchIndividualPost = async (location) => {
  // location will be /USERNAME/postID
  // [1] = post owners username
  // [2] = post id
  const locationArray = location.split('/');

  const auth = getAuth();

  const userRef = doc(db, 'users', locationArray[1]);
  const userSnap = await getDoc(userRef);

  const postRef = doc(db, 'users', locationArray[1], 'posts', locationArray[2]);
  const postSnap = await getDoc(postRef);

  if (userSnap.exists()) {
    if (postSnap.exists()) {
      return {
        username: userSnap.data().username,
        photoURL: userSnap.data().photoURL,
        post: postSnap.data(),
        likeCount: postSnap.data().likes.length,
        userLikes: postSnap.data().likes.includes(auth.currentUser.displayName),
      };
    }

    return 'Post not found';
  }
  return 'User not found';
};

export const toggleLikePost = async (location) => {
  // location will be /USERNAME/postID
  // [1] = post owners username
  // [2] = post id
  const locationArray = location.split('/');

  const auth = getAuth();

  const userRef = doc(db, 'users', locationArray[1]);
  const userSnap = await getDoc(userRef);

  const postRef = doc(db, 'users', locationArray[1], 'posts', locationArray[2]);
  const postSnap = await getDoc(postRef);

  if (userSnap.exists() && postSnap.exists()) {
    const post = postSnap.data();

    if (!post.likes.includes(auth.currentUser.displayName)) {
      post.likes.push(auth.currentUser.displayName);
    } else {
      post.likes = post.likes.filter(
        (user) => user !== auth.currentUser.displayName
      );
    }

    await updateDoc(postRef, {
      likes: post.likes,
    });

    return post.likes.includes(auth.currentUser.displayName);
  }

  return 'Error';
};

export const addComment = async (post, comment) => {
  const postOwner = post.storageUrl.split('/')[0];
  const auth = getAuth();
  const postRef = doc(db, 'users', postOwner, 'posts', post.id);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const postData = postSnap.data();

    postData.comments.push({
      comment,
      by: auth.currentUser.displayName,
      timestamp: Timestamp.now(),
      likes: [],
      replies: [],
      key: uuidv4(),
    });

    await updateDoc(postRef, {
      comments: postData.comments,
    });

    return postData.comments;
  }

  return 'Error';
};

export const getProfilePicture = async (user) => {
  const docRef = doc(db, 'users', user);
  const docSnap = await getDoc(docRef);
  return docSnap.data().photoURL;
};

export const getFeed = async () => {
  const auth = getAuth();

  const userRef = doc(db, 'users', auth.currentUser.displayName);
  const docSnap = await getDoc(userRef);

  const q = query(
    collectionGroup(db, 'posts'),
    where('owner', 'in', docSnap.data().following),
    orderBy('timestamp', 'asc')
  );

  const querySnapshot = await getDocs(q);

  const followingUsersPosts = [];
  querySnapshot.forEach((post) => followingUsersPosts.push(post.data()));
  return followingUsersPosts;
};
