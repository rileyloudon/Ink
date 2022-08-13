import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInAnonymously,
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
  deleteDoc,
  startAt,
  endAt,
  addDoc,
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

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

export const registerUser = async (email, password, tempUsername) => {
  const username = tempUsername.toLowerCase();
  const docRef = doc(db, 'users', username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) return 'A user with that username already exists.';

  const auth = getAuth();

  const register = await createUserWithEmailAndPassword(
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

  return register;
};

export const setupUser = async ({ tempUsername, fullName }) => {
  const username = tempUsername.toLowerCase();
  const auth = getAuth();
  const usersProfilePicture = `https://source.boringavatars.com/beam/150/${username}?colors=FFABAB,FFDAAB,DDFFAB,ABE4FF,D9ABFF`;

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
    followRequests: 0,
    allowMessages: 'all',
    newFollowers: [],
    newLikes: [],
    uid: auth.currentUser.uid,
  }).catch((err) => {
    return `Error updating profile, ${err}`;
  });
};

export const signInUser = async (email, password) => {
  const auth = getAuth();

  const signIn = await signInWithEmailAndPassword(auth, email, password).catch(
    (err) => {
      switch (err.code) {
        case 'auth/invalid-email':
          return 'Enter a valid email address.';
        case 'auth/user-not-found':
          return "The email you entered doesn't belong to an account.";
        case 'auth/wrong-password':
          return 'Your password was incorrect. Please double-check your password.';
        default:
          return 'Error';
      }
    }
  );

  return signIn;
};

export const signInAnon = async () => {
  const auth = getAuth();
  await signInAnonymously(auth);
};

export const setupAnon = async () => {
  const auth = getAuth();
  await updateProfile(auth.currentUser, {
    displayName: 'guest',
    photoURL: `https://source.boringavatars.com/beam/150/guest?colors=FFABAB,FFDAAB,DDFFAB,ABE4FF,D9ABFF`,
  }).catch((err) => {
    return `Error updating profile, ${err}`;
  });
};

export const signOutUser = async () => {
  const auth = getAuth();
  await signOut(auth).catch((err) => `Error signing out, ${err}`);
};

export const fetchUserData = async () => {
  const auth = getAuth();

  const docRef = doc(db, 'users', auth.currentUser.displayName);
  const docSnap = await getDoc(docRef);

  if (docSnap.data().newFollowers.length >= 1) {
    await updateDoc(doc(db, 'users', auth.currentUser.displayName), {
      newFollowers: [],
    });
  }

  if (docSnap.data().newLikes.length >= 1) {
    await updateDoc(doc(db, 'users', auth.currentUser.displayName), {
      newLikes: [],
    });
  }

  return docSnap.data();
};

export const fetchUserProfileData = async (username) => {
  const auth = getAuth();
  const docRef = doc(db, 'users', username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (
      username === auth.currentUser.displayName ||
      !docSnap.data().private ||
      docSnap.data().followers.includes(auth.currentUser.displayName)
    ) {
      const postsRef = query(
        collection(db, 'users', username, 'posts'),
        orderBy('timestamp', 'desc'),
        limit(12)
      );

      const postsSnap = await getDocs(postsRef);

      const posts = [];
      postsSnap.forEach((post) => posts.push(post.data()));
      return { header: docSnap.data(), initialPosts: posts };
    }
    const requestDocRef = doc(
      db,
      'users',
      username,
      'followRequests',
      auth.currentUser.displayName
    );
    const followRequest = await getDoc(requestDocRef);
    return {
      header: docSnap.data(),
      initialPosts: 'private',
      followRequest: followRequest.exists(),
    };
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

export const followUser = async (followedUser) => {
  const auth = getAuth();

  const currentUser = doc(db, 'users', auth.currentUser.displayName);
  const otherUser = doc(db, 'users', followedUser);

  await updateDoc(currentUser, {
    following: arrayUnion(followedUser),
  });

  await updateDoc(otherUser, {
    followers: arrayUnion(auth.currentUser.displayName),
    newFollowers: arrayUnion(auth.currentUser.displayName),
  });

  const docSnap = await getDoc(doc(db, 'users', followedUser));
  return docSnap.data();
};

export const unfollowUser = async (followedUser) => {
  const auth = getAuth();

  const currentUser = doc(db, 'users', auth.currentUser.displayName);
  const otherUser = doc(db, 'users', followedUser);

  await updateDoc(currentUser, {
    following: arrayRemove(followedUser),
  });

  await updateDoc(otherUser, {
    followers: arrayRemove(auth.currentUser.displayName),
    newFollowers: arrayRemove(auth.currentUser.displayName),
  });

  const docSnap = await getDoc(doc(db, 'users', followedUser));
  return docSnap.data();
};

export const sendFollowRequest = async (followedUser) => {
  const auth = getAuth();
  const docRef = doc(
    db,
    'users',
    followedUser,
    'followRequests',
    auth.currentUser.displayName
  );

  await updateDoc(doc(db, 'users', followedUser), {
    followRequests: increment(1),
  });

  await setDoc(docRef, {
    username: auth.currentUser.displayName,
    date: Timestamp.now(),
    followedUser,
  });

  return true;
};

export const cancelFollowRequest = async (followedUser) => {
  const auth = getAuth();
  const docRef = doc(
    db,
    'users',
    followedUser,
    'followRequests',
    auth.currentUser.displayName
  );

  const docSnap = await getDoc(docRef);

  // Check if request currently exists, if not, unfollow.
  if (docSnap.exists()) {
    await updateDoc(doc(db, 'users', followedUser), {
      followRequests: increment(-1),
    });

    await deleteDoc(docRef);
  } else {
    unfollowUser(followedUser);
  }

  return false;
};

export const acceptFollowRequest = async (requestedUser) => {
  const auth = getAuth();

  const currentUser = doc(db, 'users', auth.currentUser.displayName);
  const otherUser = doc(db, 'users', requestedUser);

  const requestExists = await getDoc(
    doc(
      db,
      'users',
      auth.currentUser.displayName,
      'followRequests',
      requestedUser
    )
  );

  if (requestExists.exists()) {
    await updateDoc(currentUser, {
      followers: arrayUnion(requestedUser),
      followRequests: increment(-1),
    });

    await updateDoc(otherUser, {
      following: arrayUnion(auth.currentUser.displayName),
    });

    await deleteDoc(
      doc(
        db,
        'users',
        auth.currentUser.displayName,
        'followRequests',
        requestedUser
      )
    );
  }
};

export const denyFollowRequest = async (requestedUser) => {
  const auth = getAuth();

  const currentUser = doc(db, 'users', auth.currentUser.displayName);

  const requestExists = await getDoc(
    doc(
      db,
      'users',
      auth.currentUser.displayName,
      'followRequests',
      requestedUser
    )
  );

  if (requestExists.exists()) {
    await updateDoc(currentUser, {
      followRequests: increment(-1),
    });

    await deleteDoc(
      doc(
        db,
        'users',
        auth.currentUser.displayName,
        'followRequests',
        requestedUser
      )
    );
  }
};

export const updateUserSettings = async (
  changed,
  profilePcture,
  name,
  bio,
  privateAccount,
  allowMessages
) => {
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

    // if going from private -> unprivated, set all follow requests to follow
    if (changed.privateAccount) {
      await updateDoc(docRef, {
        private: privateAccount,
      });
      if (!privateAccount) {
        const docSnap = await getDoc(docRef);
        if (docSnap.data().followRequests >= 1) {
          const requestsRef = collection(
            db,
            'users',
            auth.currentUser.displayName,
            'followRequests'
          );
          const requestSnap = await getDocs(requestsRef);
          requestSnap.forEach((user) =>
            acceptFollowRequest(user.data().username)
          );
          await updateDoc(docRef, {
            followRequests: 0,
          });
        }
      }
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

    if (changed.allowMessages) {
      await updateDoc(docRef, {
        allowMessages,
      });
    }

    return { updated: true };
  } catch (err) {
    return { updated: false, err };
  }
};

export const updatePost = async (
  postId,
  changed,
  caption,
  disableComments,
  hideComments
) => {
  const auth = getAuth();
  const docRef = doc(
    db,
    'users',
    auth.currentUser.displayName,
    'posts',
    postId
  );

  try {
    if (changed.caption) {
      await updateDoc(docRef, {
        caption,
      });
    }

    if (changed.disableComments) {
      await updateDoc(docRef, {
        disableComments,
      });
    }

    if (changed.hideComments) {
      await updateDoc(docRef, {
        hideComments,
      });
    }

    return { updated: true };
  } catch (err) {
    return { updated: false, err };
  }
};

export const deletePost = async (post) => {
  const auth = getAuth();
  const storage = getStorage();

  try {
    await deleteDoc(
      doc(db, 'users', auth.currentUser.displayName, 'posts', post.id)
    );

    await deleteObject(ref(storage, post.storageUrl));

    await updateDoc(doc(db, 'users', auth.currentUser.displayName), {
      postCount: increment(-1),
    });

    return { deleted: true };
  } catch (err) {
    return { deleted: false, err };
  }
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
      uid: auth.currentUser.uid,
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

  const userRef = doc(db, 'users', post.owner);
  const postRef = doc(db, 'users', post.owner, 'posts', post.id);
  const postSnap = await getDoc(postRef);

  if (!postSnap.data().likes.includes(auth.currentUser.displayName)) {
    await updateDoc(postRef, {
      likes: arrayUnion(auth.currentUser.displayName),
    });

    await updateDoc(userRef, {
      newLikes: arrayUnion({
        username: auth.currentUser.displayName,
        postId: post.id,
        postPhoto: post.imageUrl,
      }),
    });
  } else {
    await updateDoc(postRef, {
      likes: arrayRemove(auth.currentUser.displayName),
    });

    await updateDoc(userRef, {
      newLikes: arrayRemove({
        username: auth.currentUser.displayName,
        postId: post.id,
        postPhoto: post.imageUrl,
      }),
    });
  }

  return !postSnap.data().likes.includes(auth.currentUser.displayName);
};

export const addComment = async (post, comment) => {
  const auth = getAuth();
  const postRef = doc(db, 'users', post.owner, 'posts', post.id);

  const newComment = {
    comment,
    by: auth.currentUser.displayName,
    timestamp: Timestamp.now(),
    likes: [],
    replies: [],
    key: uuidv4(),
  };

  await updateDoc(postRef, {
    comments: arrayUnion(newComment),
  });

  return newComment;
};

export const deleteComment = async (post, comment) => {
  const postRef = doc(db, 'users', post.owner, 'posts', post.id);

  await updateDoc(postRef, {
    comments: arrayRemove(comment),
  });
};

export const fetchProfilePicture = async (user) => {
  if (typeof user === 'string') {
    const docRef = doc(db, 'users', user);
    const docSnap = await getDoc(docRef);
    return docSnap.data().photoURL;
  }

  // if user is an array, fetch all pictures
  // returns both username and photoURL because 'in' doesn't keep array order
  // (1 would match first because 1 is at the top in db, causing miss match)
  let userCopy = [...user];
  if (user.length > 0 && user[0].username) {
    const tempCopy = userCopy.map((item) => item.username);
    userCopy = [...new Set(tempCopy)];
  }

  const batches = [];

  // Since firebase 'in' has a limit of 10, we need to seperate userCopy
  // into batches of 10 to prevent error on large arrays
  while (userCopy.length) {
    const batch = userCopy.splice(0, 10);
    batches.push(
      getDocs(
        query(collection(db, 'users'), where('username', 'in', batch))
      ).then((res) =>
        res.docs.map((profile) => ({
          username: profile.data().username,
          photoURL: profile.data().photoURL,
        }))
      )
    );
  }

  return (await Promise.all(batches)).flat();
};

export const fetchFeed = async () => {
  const auth = getAuth();
  const userRef = doc(db, 'users', auth.currentUser.displayName);
  const docSnap = await getDoc(userRef);

  const postsFrom = [...docSnap.data().following, auth.currentUser.displayName];
  const batches = [];

  try {
    // Firebase 'in' has a limit of 10, so we need to use splice to create
    // batches of 10.
    while (postsFrom.length) {
      const batch = postsFrom.splice(0, 10);
      batches.push(
        getDocs(
          query(
            collectionGroup(db, 'posts'),
            where('owner', 'in', batch),
            orderBy('timestamp', 'desc')
          )
        ).then((res) => res.docs.map((post) => post.data()))
      );
    }

    const data = (await Promise.all(batches)).flat();
    return data.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.log(err);
    return [];
  }
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

export const fetchNextLikedPosts = async (start) => {
  const auth = getAuth();

  try {
    const q = query(
      collectionGroup(db, 'posts'),
      where('likes', 'array-contains', auth.currentUser.displayName),
      orderBy('timestamp', 'desc'),
      startAfter(start),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((post) => posts.push(post.data()));
    return posts;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const fetchFollowRequests = async () => {
  const auth = getAuth();
  const querySnapshot = await getDocs(
    collection(db, 'users', auth.currentUser.displayName, 'followRequests')
  );

  const users = [];
  const pictures = [];

  querySnapshot.forEach((user) => {
    const profilePicture = fetchProfilePicture(user.data().username);
    pictures.push(profilePicture);
    users.push(user.data());
  });

  const profilePictures = await Promise.all(pictures);
  return { users, profilePictures };
};

export const forgotPassword = async (email) => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (e) {
    switch (e.code) {
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/user-not-found':
        return "The email you entered doesn't belong to an account.";
      default:
        return 'Error';
    }
  }
  return 'Email sent';
};

export const changePassword = async (currentPassword, newPassword) => {
  const auth = getAuth();
  const { email } = auth.currentUser;
  const crediential = EmailAuthProvider.credential(email, currentPassword);
  try {
    await reauthenticateWithCredential(auth.currentUser, crediential);
    await updatePassword(auth.currentUser, newPassword);
  } catch (e) {
    switch (e.code) {
      case 'auth/wrong-password':
        return 'Your current password was incorrect.';
      case 'auth/weak-password':
        return 'Please enter a stronger password';
      default:
        return 'Error';
    }
  }
  return true;
};

export const searchUsers = async (searchTerm) => {
  try {
    const searchRef = query(
      collection(db, 'users'),
      orderBy('username'),
      startAt(searchTerm),
      endAt(`${searchTerm}~`),
      limit(5)
    );

    const searchSnap = await getDocs(searchRef);
    const matchingUsers = [];
    searchSnap.forEach((user) => matchingUsers.push(user.data()));
    return matchingUsers;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const sendMessage = async (otherUser, message) => {
  try {
    const auth = getAuth();

    await addDoc(
      collection(
        db,
        'users',
        auth.currentUser.displayName,
        'chat',
        otherUser,
        'messages'
      ),
      {
        message,
        date: Timestamp.now(),
        to: otherUser,
        from: auth.currentUser.displayName,
        fromUid: auth.currentUser.uid,
      }
    );

    await setDoc(
      doc(db, 'users', auth.currentUser.displayName, 'chat', otherUser),
      {
        lastMessage: Timestamp.now(),
        chatUsers: [auth.currentUser.displayName, otherUser],
      }
    );

    if (otherUser !== auth.currentUser.displayName) {
      await addDoc(
        collection(
          db,
          'users',
          otherUser,
          'chat',
          auth.currentUser.displayName,
          'messages'
        ),
        {
          message,
          date: Timestamp.now(),
          to: otherUser,
          from: auth.currentUser.displayName,
          fromUid: auth.currentUser.uid,
        }
      );

      await setDoc(
        doc(db, 'users', otherUser, 'chat', auth.currentUser.displayName),
        {
          lastMessage: Timestamp.now(),
          chatUsers: [auth.currentUser.displayName, otherUser],
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

export const fetchLatestChatUsers = async () => {
  const auth = getAuth();
  try {
    const q = query(
      collection(db, 'users', auth.currentUser.displayName, 'chat'),
      orderBy('lastMessage', 'desc'),
      limit(3)
    );

    const querySnapshot = await getDocs(q);
    const users = [];
    const pictures = [];
    querySnapshot.forEach((user) => {
      const profilePicture = fetchProfilePicture(user.id);
      pictures.push(profilePicture);
      users.push(user.id);
    });

    const profilePictures = await Promise.all(pictures);
    return { users, profilePictures };
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const fetchAllowMessages = async (user) => {
  const auth = getAuth();
  const userRef = doc(db, 'users', user);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (
      data.allowMessages === 'followers' &&
      !data.followers.includes(auth.currentUser.displayName)
    ) {
      // checks if a chat already exists, if so allow messages
      const docSnap2 = await getDoc(
        doc(db, 'users', user, 'chat', auth.currentUser.displayName)
      );
      if (docSnap2.exists()) return { allow: true };
      return { allow: false, reason: 'not-following' };
    }
    if (data.allowMessages === 'none') {
      return { allow: false, reason: 'messages-disabled' };
    }
    return { allow: true };
  }
  return null;
};
