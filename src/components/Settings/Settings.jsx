import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { updateUserSettings } from '../../firebase';
import { ReactComponent as Spinner } from '../../img/spinner/spinner.svg';
import ChangePicture from './ChangePicture/ChangePicture';
import ChangePassword from './ChangePassword/ChangePassword';
import './Settings.css';

const Settings = () => {
  // Settings uses two copys of data:
  // userData is the current values in the database
  // useState data is the data in the form. It can be changed then saved to the database when ready

  const { user, setUser } = useContext(UserContext);

  const [newProfilePicture, setNewProfilePicture] = useState('');

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowMessages, setAllowMessages] = useState('');
  const [error, setError] = useState();
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const changedData = user
    ? newProfilePicture ||
      user.fullName !== name ||
      user.bio !== bio ||
      user.private !== privateAccount ||
      user.allowMessages !== allowMessages
    : null;

  const updateNewProfilePicture = (value) => setNewProfilePicture(value);

  const saveSettings = async () => {
    const changed = {
      profilePicture: newProfilePicture !== '',
      name: user.fullName !== name,
      bio: user.bio !== bio,
      privateAccount: user.private !== privateAccount,
      allowMessages: user.allowMessages !== allowMessages,
    };

    setButtonLoading(true);
    const res = await updateUserSettings(
      changed,
      newProfilePicture,
      name,
      bio,
      privateAccount,
      allowMessages
    );

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
        allowMessages,
      }));
      setProfileUpdated(true);
    } else {
      setError(res.err.message);
      setProfileUpdated(false);
    }
    setButtonLoading(false);
  };

  useEffect(() => {
    if (user) {
      setName(user.fullName);
      setBio(user.bio);
      setPrivateAccount(user.private);
      setAllowMessages(user.allowMessages);
    }
  }, [user]);

  useEffect(() => {
    return () => URL.revokeObjectURL(newProfilePicture.url);
  }, [newProfilePicture]);

  useEffect(() => {
    if (changedData) setProfileUpdated(false);
  }, [changedData]);

  return user ? (
    <>
      <div className='profile-settings'>
        <section>
          <img src={newProfilePicture.url || user.photoURL} alt='' />
          <span>{user.username}</span>
        </section>
        <ChangePicture updateNewProfilePicture={updateNewProfilePicture} />
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
          </label>
          {user.followRequests >= 1 && (
            <Link to='/settings/follow-requests' className='follow-requests'>
              {user.followRequests} follow request
              {user.followRequests === 1 ? '' : 's'}
            </Link>
          )}
          <label htmlFor='allow-messages' className='allow-messages'>
            <span>Allow Messages From</span>
            <select
              name='allow-messages'
              defaultValue={user.allowMessages}
              onChange={(e) => setAllowMessages(e.target.value)}
            >
              <option value='everyone'>Everyone</option>
              <option value='followers'>Followers</option>
              <option value='nobody'>Nobody</option>
            </select>
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
          {profileUpdated && <p className='profile-updated'>Profile Updated</p>}
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
      </div>
      {user.username !== 'guest' && <ChangePassword />}
    </>
  ) : null;
};

export default Settings;
