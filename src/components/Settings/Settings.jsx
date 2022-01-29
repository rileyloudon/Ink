/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import UserContext from '../../Context/UserContext';
import ThemeContext from '../../Context/ThemeContext';
import { updateUserSettings } from '../../firebase';
import { ReactComponent as Spinner } from '../../img/spinner/spinner.svg';
import './Settings.css';

const Settings = () => {
  // Settings uses two copys of data:
  // userData is the current values in the database
  // useState data is the data in the form. It can be changed then saved to the database when ready

  // change full name
  // change profile picture
  // change bio
  // delete account
  // dark mode -> save in localstorage, check preference on load

  // edit posts -> change caption, disable comments, hide current comments

  // change password (?)
  // private account (?)
  const { user, setUser } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);

  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [pictureRejected, setPictureRejected] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [privateAccount, setPrivateAccount] = useState(false);
  const [error, setError] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);

  const changedData = user
    ? newProfilePicture ||
      user.fullName !== name ||
      user.bio !== bio ||
      user.private !== privateAccount
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

  const changeTheme = (e) => {
    if (e.target.checked) {
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  const saveSettings = () => {
    const changed = {
      profilePicture: newProfilePicture !== '',
      name: user.fullName !== name,
      bio: user.bio !== bio,
      privateAccount: user.private !== privateAccount,
    };

    setButtonLoading(true);
    updateUserSettings(
      changed,
      newProfilePicture,
      name,
      bio,
      privateAccount
    ).then((res) => {
      if (res.updated === true) {
        if (res.publicImageUrl) {
          setUser((prevData) => ({
            ...prevData,
            photoURL: res.publicImageUrl,
          }));
          setNewProfilePicture('');
        }
        setUser((prevData) => ({
          ...prevData,
          fullName: name,
          bio,
          private: privateAccount,
        }));
        setButtonLoading(false);
      } else {
        setError(res.err);
        setButtonLoading(false);
      }
    });
  };

  useEffect(() => {
    if (user) {
      setName(user.fullName);
      setBio(user.bio);
      setPrivateAccount(user.private);
    }
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
          <label htmlFor='toggle-private' className='private-account'>
            <span>Private Account</span>
            <input
              type='checkbox'
              name='toggle-private'
              id='toggle-private'
              checked={privateAccount}
              onChange={(e) => setPrivateAccount(e.target.checked)}
            />
            <span className='checkmark' />
            {/* {privateAccount ? <Checked /> : <Unchecked />} */}
          </label>
          <label htmlFor='change-name' className='input'>
            <p>Name</p>
            <input
              type='text'
              id='change-name'
              name='change-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor='change-bio' className='input'>
            <p>Bio</p>
            <textarea
              name='bio'
              id='change-bio'
              value={bio}
              onClick={(e) => {
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onChange={(e) => {
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
                setBio(e.target.value);
              }}
            />
          </label>
          {error && <p className='error'>{error}</p>}
          <button
            className='save'
            type='button'
            disabled={!changedData}
            onClick={saveSettings}
          >
            {!buttonLoading ? 'Save' : 'Saving'}
            {buttonLoading && <Spinner className='spinner' />}
          </button>
        </form>
        <label htmlFor='toggle-theme' className='dark-mode'>
          <span>Dark Mode</span>
          <input
            type='checkbox'
            name='toggle-theme'
            id='toggle-theme'
            checked={theme === 'dark'}
            onChange={(e) => changeTheme(e)}
          />
          <span className='checkmark' />
        </label>
        {/* {theme === 'dark' ? <Checked /> : <Unchecked />} */}
        <button type='button'>Delete Account</button>
      </div>
    </>
  ) : null;
};

export default Settings;
