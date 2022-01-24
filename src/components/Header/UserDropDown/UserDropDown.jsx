import { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { signOutUser } from '../../../firebase';
import './UserDropDown.css';
import UserContext from '../../../Context/UserContext';

const UserDropDown = ({ closeUserDropDown }) => {
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
        closeUserDropDown();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeUserDropDown]);

  return (
    <div className='user-drop-down-container'>
      <div ref={dropDown} className='user-drop-down'>
        <button
          type='button'
          onClick={() => {
            closeUserDropDown();
            history.push(`/${user.username}`);
          }}
        >
          Profile
        </button>
        <button
          type='button'
          onClick={() => {
            closeUserDropDown();
            history.push(`/${user.username}/liked`);
          }}
        >
          Liked
        </button>
        <button
          type='button'
          onClick={() => {
            closeUserDropDown();
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

UserDropDown.propTypes = {
  closeUserDropDown: PropTypes.func.isRequired,
};

export default UserDropDown;
