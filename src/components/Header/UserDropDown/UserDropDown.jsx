import { useContext, useRef } from 'react';
// import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { signOutUser } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import './UserDropdown.css';

const UserDropdown = () => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const userDropDown = useRef();

  const handleClickOutside = (e) => {
    if (
      userDropDown.current &&
      !userDropDown.current.contains(e.target) &&
      e.target.className !== 'profile-picture' &&
      document.getElementById(`user-dropdown`).classList.contains('displayed')
    ) {
      document.getElementById(`user-dropdown`).classList.remove('displayed');
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  const handleClick = () => {
    const post = document.getElementById(`user-dropdown`);

    if (post.classList.contains('displayed'))
      document.removeEventListener('mousedown', handleClickOutside);
    else document.addEventListener('mousedown', handleClickOutside);
    post.classList.toggle('displayed');
  };

  const removeEverything = () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.getElementById(`user-dropdown`).classList.remove('displayed');
  };

  return (
    <div className='user-dropdown-container'>
      <button type='button' className='profile-border' onClick={handleClick}>
        <img className='profile-picture' src={user.photoURL} alt='' />
      </button>
      <div ref={userDropDown} id='user-dropdown'>
        <button
          type='button'
          onClick={() => {
            removeEverything();
            history.push(`/${user.username}`);
          }}
        >
          Profile
        </button>
        <button
          type='button'
          onClick={() => {
            removeEverything();
            history.push(`/${user.username}/liked`);
          }}
        >
          Liked
        </button>
        <button
          type='button'
          onClick={() => {
            removeEverything();
            history.push('/settings');
          }}
        >
          Settings
        </button>
        <div className='sign-out'>
          <button
            type='button'
            onClick={() => {
              removeEverything();
              signOutUser().then(() => history.push('/'));
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

// UserDropdown.propTypes = {
//   closeUserDropdown: PropTypes.func.isRequired,
// };

export default UserDropdown;
