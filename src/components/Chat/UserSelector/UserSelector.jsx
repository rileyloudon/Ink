import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { fetchLatestChatUsers } from '../../../firebase';
import Search from '../../Search/Search';
import './UserSelector.css';

const UserSelector = ({ currentSelectedUser, updateCurrentSelectedUser }) => {
  const [pastChats, setPastChats] = useState(null);

  useEffect(() => {
    if (currentSelectedUser) {
      if (!pastChats) {
        setPastChats({
          users: currentSelectedUser.username,
          profilePictures: currentSelectedUser.photoURL,
        });
      } else if (!pastChats.users.includes(currentSelectedUser.username)) {
        setPastChats((prevState) => ({
          users: [currentSelectedUser.username, ...prevState.users],
          profilePictures: [
            currentSelectedUser.photoURL,
            ...prevState.profilePictures,
          ],
        }));
      }
    }
  }, [currentSelectedUser, pastChats]);

  useEffect(() => {
    let isSubscribed = true;
    console.log('s');

    (async () => {
      // res returns an object: users & profilePictures
      // thry will be in the same order so users[0] goes with profilePictures[0]
      const res = await fetchLatestChatUsers();
      if (isSubscribed) {
        setPastChats(res);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return pastChats ? (
    <div className='user-selector'>
      <h3>Chat</h3>
      <h4>To</h4>
      <Search updateCurrentSelectedUser={updateCurrentSelectedUser} />
      {/* Search box to find users to chat to. Check 'allowMessages' user value */}
      <h4>Past Chats</h4>
      {pastChats.users.map((user, i) => {
        return (
          <button
            className='past-chat'
            type='button'
            key={user}
            onClick={() =>
              updateCurrentSelectedUser({
                username: user,
                photoURL: pastChats.profilePictures[i],
              })
            }
          >
            <img src={pastChats.profilePictures[i]} alt='' />
            <span>{user}</span>
          </button>
        );
      })}
    </div>
  ) : null;
};

export default UserSelector;

UserSelector.defaultProps = {
  currentSelectedUser: null,
};

UserSelector.propTypes = {
  currentSelectedUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
  }),
  updateCurrentSelectedUser: PropTypes.func.isRequired,
};
