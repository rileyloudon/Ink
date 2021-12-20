import { useContext, useEffect, useState } from 'react';
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
  const { user } = useContext(UserContext);

  const [userData, setUserData] = useState();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState();

  const changedData = userData
    ? userData.fullName !== name || userData.bio !== bio
    : null;

  const saveSettings = () => {
    const changed = {
      name: userData.fullName !== name,
      bio: userData.bio !== bio,
    };

    updateUserSettings(changed, name, bio).then((res) => {
      if (res === true) {
        setUserData((prevData) => ({
          ...prevData,
          fullName: name,
          bio,
        }));
      } else {
        setError(res);
      }
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    if (user)
      fetchUserData(user.displayName).then((res) => {
        if (isSubscribed) {
          setUserData(res);
          setName(res.fullName);
          setBio(res.bio);
        }
      });
    return () => {
      isSubscribed = false;
    };
  }, [user]);

  return userData ? (
    <>
      <div className='profile-settings'>
        <h3>Profile Settings</h3>
        <section>
          {/* Click img to open change picture modal */}
          <img src={userData.photoURL} alt='' />
          <span>{userData.username}</span>
        </section>
        <button type='button'>Change profile picture</button>
        <form>
          <label htmlFor='change-name'>
            Name
            <input
              type='text'
              id='change-name'
              name='change-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor='change-bio'>
            Bio
            <textarea
              name='bio'
              id='change-bio'
              cols='30'
              rows='10'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
        </form>
      </div>
      {error && <p>{error}</p>}
      <button
        type='button'
        disabled={!changedData}
        onClick={() => {
          if (changedData) saveSettings();
        }}
      >
        Save
      </button>
      <button type='button'>Delete Account</button>
    </>
  ) : null;
};

export default Settings;
