import { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { signOutUser } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import './UserDropdown.css';

const UserDropdown = ({ closeUserDropdown }) => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const dropDown = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropDown.current &&
        !dropDown.current.contains(e.target) &&
        e.target.className !== 'profile-picture'
      )
        closeUserDropdown();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeUserDropdown]);

  return (
    <div className='user-dropdown-container'>
      <div ref={dropDown} className='user-dropdown'>
        <button
          type='button'
          onClick={() => {
            closeUserDropdown();
            history.push(`/${user.username}`);
          }}
        >
          Profile
        </button>
        <button
          type='button'
          onClick={() => {
            closeUserDropdown();
            history.push(`/${user.username}/liked`);
          }}
        >
          Liked
        </button>
        <button
          type='button'
          onClick={() => {
            closeUserDropdown();
            history.push('/settings');
          }}
        >
          Settings
        </button>
        <div className='sign-out'>
          <button
            type='button'
            onClick={() => {
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

UserDropdown.propTypes = {
  closeUserDropdown: PropTypes.func.isRequired,
};

export default UserDropdown;
