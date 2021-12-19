import { useContext, useEffect, useState } from 'react';
import UserContext from '../../Context/UserContext';
import { fetchUserData } from '../../firebase';
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

  useEffect(() => {
    let isSubscribed = true;
    if (user)
      fetchUserData(user.displayName).then((res) => {
        if (isSubscribed) setUserData(res);
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
              value={userData.fullName}
            />
          </label>
          <label htmlFor='change-bio'>
            Bio
            <textarea
              name='bio'
              id='change-bio'
              cols='30'
              rows='10'
              value={userData.bio}
            />
          </label>
        </form>
      </div>

      <button type='button'>Save</button>
      <button type='button'>Delete Account</button>
    </>
  ) : null;
};

export default Settings;
