/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import UserContext from '../../Context/UserContext';
import { fetchUserData, updateUserSettings } from '../../firebase';
import './Settings.css';

const Settings = () => {
  // change full name
  // change profile picture
  // change bio
  // delete account
  // dark mode -> save in localstorage, check preference on load

  // edit posts -> change caption, disable comments, hide current comments

  // change password (?)
  // private account (?)
  const { user, setUser } = useContext(UserContext);

  const [userData, setUserData] = useState();

  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [pictureRejected, setPictureRejected] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState();

  const changedData = userData
    ? newProfilePicture || userData.fullName !== name || userData.bio !== bio
    : null;

  const onDropAccepted = useCallback((acceptedFiles) => {
    setNewProfilePicture({
      properties: acceptedFiles[0],
      url: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);

  const onDropRejected = useCallback((rejectedFile) => {
    if (rejectedFile[0].file.size > 5000000)
      setPictureRejected('Please select a picture that is less than 5MB');
    else setPictureRejected('Please select a .jpeg or .png file');
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    accept: 'image/jpeg, image/png',
    maxSize: 5000000, // 5MB
    noClick: true,
    noKeyboard: true,
    noDrag: true,
    onDropAccepted,
    onDropRejected,
  });

  const saveSettings = () => {
    const changed = {
      profilePicture: newProfilePicture !== '',
      name: userData.fullName !== name,
      bio: userData.bio !== bio,
    };

    updateUserSettings(changed, newProfilePicture, name, bio).then((res) => {
      if (res.updated === true) {
        if (res.publicImageUrl) {
          setUser((prevData) => ({
            ...prevData,
            photoURL: res.publicImageUrl,
          }));
          setNewProfilePicture('');
        }
        setUserData((prevData) => ({
          ...prevData,
          fullName: name,
          bio,
        }));
      } else {
        setError(res.err);
      }
    });
  };

  useEffect(() => {
    let isSubscribed = true;

    if (user)
      fetchUserData(user.displayName).then((res) => {
        if (isSubscribed) {
          setName(res.fullName);
          setBio(res.bio);
          setUserData(res);

          const textarea = document.getElementById('change-bio');
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      });
    return () => {
      isSubscribed = false;
    };
  }, [user]);

  useEffect(() => {
    return () => URL.revokeObjectURL(newProfilePicture.url);
  }, [newProfilePicture]);

  return user ? (
    <>
      <div className='profile-settings'>
        <section>
          <img src={newProfilePicture.url || user.photoURL} alt='' />
          <span>{user.displayName}</span>
        </section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <button
            className='change-profile-picture'
            type='button'
            onClick={open}
          >
            Change Profile Picture
          </button>
          {pictureRejected && <p className='error'>{pictureRejected}</p>}
        </div>
        <form>
          <label htmlFor='change-name'>
            <p>Name</p>
            <input
              type='text'
              id='change-name'
              name='change-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor='change-bio'>
            <p>Bio</p>
            <textarea
              name='bio'
              id='change-bio'
              value={bio}
              onChange={(e) => {
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
                setBio(e.target.value);
              }}
            />
          </label>
        </form>
        {error && <p className='error'>{error}</p>}
        <button
          className='save'
          type='button'
          disabled={!changedData}
          onClick={saveSettings}
        >
          Save
        </button>
        <button type='button'>Delete Account</button>
      </div>
    </>
  ) : null;
};

export default Settings;
