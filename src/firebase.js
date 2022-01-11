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
  startAfter,
  limit,
  increment,
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
  const usersProfilePicture = `https://source.boringavatars.com/beam/150/${username}?colors=FFABAB,FFDAAB,DDFFAB,ABE4FF,D9ABFF`;
  const docRef = doc(db, 'users', username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) return 'A user with that username already exists.';

  const auth = getAuth();

  await createUserWithEmailAndPassword(auth, email, password).catch((err) => {
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
    photoURL: usersProfilePicture,
  }).catch((err) => {
    return `Error updating profile, ${err}`;
  });

  await setDoc(doc(db, 'users', username), {
    username,
    photoURL: usersProfilePicture,
    fullName,
    followers: [],
    following: [],
    bio: '',
    postCount: 0,
    private: false,
    allowMessages: 'all',
  }).catch((err) => {
    return `Error updating profile, ${err}`;
  });

  return { displayName: username, photoURL: usersProfilePicture };
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

export const updateUserSettings = async (changed, profilePcture, name, bio) => {
  const auth = getAuth();
  const docRef = doc(db, 'users', auth.currentUser.displayName);

  try {
    if (changed.name) {
      await updateDoc(docRef, {
        fullName: name,
      });
    }

    if (changed.bio) {
      await updateDoc(docRef, {
        bio,
      });
    }

    if (changed.profilePicture) {
      const storage = getStorage();

      const storageRef = ref(
        storage,
        `${auth.currentUser.displayName}/profile-picture`
      );

      await uploadBytes(storageRef, profilePcture.properties);

      const publicImageUrl = await getDownloadURL(storageRef);

      await updateDoc(docRef, {
        photoURL: publicImageUrl,
      });
      await updateProfile(auth.currentUser, {
        photoURL: publicImageUrl,
      });

      return { updated: true, publicImageUrl };
    }

    return { updated: true };
  } catch (err) {
    return { updated: false, err };
  }
};

export const fetchUserData = async (username) => {
  const docRef = doc(db, 'users', username);
  const docSnap = await getDoc(docRef);

  return docSnap.data();
};

export const fetchUserProfileData = async (username) => {
  const docRef = doc(db, 'users', username);
  const docSnap = await getDoc(docRef);

  const postsRef = query(
    collection(db, 'users', username, 'posts'),
    orderBy('timestamp', 'desc'),
    limit(12)
  );

  const postsSnap = await getDocs(postsRef);

  if (docSnap.exists()) {
    const posts = [];
    postsSnap.forEach((post) => posts.push(post.data()));
    return { header: docSnap.data(), initialPosts: posts };
  }
  return 'User not found';
};

export const fetchNextProfilePosts = async (username, start) => {
  const postsRef = query(
    collection(db, 'users', username, 'posts'),
    orderBy('timestamp', 'desc'),
    startAfter(start),
    limit(6)
  );

  const postsSnap = await getDocs(postsRef);
  const posts = [];
  postsSnap.forEach((post) => posts.push(post.data()));
  return posts;
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

//     return 'p';
//   }
//   // Unfollow User
//   await updateDoc(me, {
//     following: arrayRemove(userToInteract),
//   });

//   await updateDoc(otherUser, {
//     followers: arrayRemove(auth.currentUser.displayName),
//   });

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
      `${auth.currentUser.displayName}/${image.properties.name}`
    );

    const upload = await uploadBytes(storageRef, image.properties);

    const publicImageUrl = await getDownloadURL(storageRef);

    const docRef = doc(
      collection(db, 'users', auth.currentUser.displayName, 'posts')
    );

    await updateDoc(doc(db, 'users', auth.currentUser.displayName), {
      postCount: increment(1),
    });

    return await setDoc(docRef, {
      owner: auth.currentUser.displayName,
      imageUrl: publicImageUrl,
      caption,
      disableComments,
      hideComments: false,
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

export const fetchIndividualPost = async (username, postId) => {
  const auth = getAuth();

  const userRef = doc(db, 'users', username);
  const userSnap = await getDoc(userRef);

  const postRef = doc(db, 'users', username, 'posts', postId);
  const postSnap = await getDoc(postRef);

  if (userSnap.exists()) {
    if (postSnap.exists()) {
      return {
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

export const toggleLikePost = async (post) => {
  const auth = getAuth();

  const postRef = doc(db, 'users', post.owner, 'posts', post.id);
  const postSnap = await getDoc(postRef);

  if (!postSnap.data().likes.includes(auth.currentUser.displayName)) {
    await updateDoc(postRef, {
      likes: arrayUnion(auth.currentUser.displayName),
    });
  } else {
    await updateDoc(postRef, {
      likes: arrayRemove(auth.currentUser.displayName),
    });
  }

  return !postSnap.data().likes.includes(auth.currentUser.displayName);
};

export const addComment = async (post, comment) => {
  const postOwner = post.storageUrl.split('/')[0];
  const auth = getAuth();
  const postRef = doc(db, 'users', postOwner, 'posts', post.id);

  await updateDoc(postRef, {
    comments: arrayUnion({
      comment,
      by: auth.currentUser.displayName,
      timestamp: Timestamp.now(),
      likes: [],
      replies: [],
      key: uuidv4(),
    }),
  });

  const docSnap = await getDoc(doc(db, 'users', postOwner, 'posts', post.id));
  return docSnap.data().comments;
};

export const fetchProfilePicture = async (user) => {
  const docRef = doc(db, 'users', user);
  const docSnap = await getDoc(docRef);
  return docSnap.data().photoURL;
};

export const fetchFeed = async () => {
  const auth = getAuth();
  const userRef = doc(db, 'users', auth.currentUser.displayName);
  const docSnap = await getDoc(userRef);

  if (docSnap.data().following.length > 0) {
    const q = query(
      collectionGroup(db, 'posts'),
      where('owner', 'in', docSnap.data().following),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const querySnapshot = await getDocs(q);

    const followingUsersPosts = [];
    querySnapshot.forEach((post) => followingUsersPosts.push(post.data()));
    return followingUsersPosts;
  }
  return [];
};

export const fetchLikedPosts = async () => {
  const auth = getAuth();
  try {
    const q = query(
      collectionGroup(db, 'posts'),
      where('likes', 'array-contains', auth.currentUser.displayName),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const querySnapshot = await getDocs(q);
    const likedPosts = [];
    querySnapshot.forEach((post) => likedPosts.push(post.data()));
    return likedPosts;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const fetchNextFeedPosts = async (type, start) => {
  const auth = getAuth();
  let docSnap;

  if (type === 'main') {
    const userRef = doc(db, 'users', auth.currentUser.displayName);
    docSnap = await getDoc(userRef);
  }

  try {
    const q = query(
      collectionGroup(db, 'posts'),
      type === 'main'
        ? where('owner', 'in', docSnap.data().following)
        : where('likes', 'array-contains', auth.currentUser.displayName),
      orderBy('timestamp', 'desc'),
      startAfter(start),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const likedPosts = [];
    querySnapshot.forEach((post) => likedPosts.push(post.data()));
    return likedPosts;
  } catch (e) {
    console.log(e);
    return [];
  }
};
