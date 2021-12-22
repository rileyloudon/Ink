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

  return userData ? (
    <>
      <div className='profile-settings'>
        <section>
          <img src={userData.photoURL} alt='' />
          {/* Click img to open change picture modal */}
          <span>{userData.username}</span>
        </section>
        <button className='change-profile-picture' type='button'>
          Change Profile Picture
        </button>
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
        {error && <p>{error}</p>}
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
