import PropTypes from 'prop-types';
import { useEffect } from 'react';
import Search from '../../Search/Search';
import './UserSelector.css';

const UserSelector = ({
  currentSelectedUser,
  updateCurrentSelectedUser,
  pastChats,
  updatePastChats,
  updateActiveTab,
}) => {
  useEffect(() => {
    if (currentSelectedUser) {
      if (!pastChats) {
        updatePastChats({
          users: currentSelectedUser.username,
          profilePictures: currentSelectedUser.photoURL,
        });
      } else if (!pastChats.users.includes(currentSelectedUser.username)) {
        updatePastChats((prevState) => ({
          users: [currentSelectedUser.username, ...prevState.users],
          profilePictures: [
            currentSelectedUser.photoURL,
            ...prevState.profilePictures,
          ],
        }));
      }
    }
  }, [currentSelectedUser, pastChats, updatePastChats]);

  return pastChats ? (
    <div className='user-selector'>
      <h4 className='to'>To</h4>
      <Search
        updateCurrentSelectedUser={updateCurrentSelectedUser}
        updateActiveTab={updateActiveTab}
      />
      {pastChats.users.length > 0 && <h4>Past Chats</h4>}
      {pastChats.users.map((user, i) => {
        return (
          <button
            className='past-chat'
            type='button'
            key={user}
            onClick={() => {
              updateCurrentSelectedUser({
                username: user,
                photoURL: pastChats.profilePictures[i],
              });
              updateActiveTab('chatting');
            }}
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
  pastChats: PropTypes.shape({
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
    profilePictures: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  updatePastChats: PropTypes.func.isRequired,
  updateActiveTab: PropTypes.func.isRequired,
};
