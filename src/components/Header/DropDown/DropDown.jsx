import { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { signOutUser } from '../../../firebase';
import './DropDown.css';
import UserContext from '../../../Context/UserContext';

const DropDown = ({ closeDropDown }) => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const dropDown = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropDown.current.contains(e.target) ||
        e.target.className === 'profile-picture'
      ) {
        return;
      }
      closeDropDown();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropDown]);

  return (
    <div className='drop-down-container'>
      <div ref={dropDown} className='user-drop-down'>
        <button
          type='button'
          onClick={() => {
            closeDropDown();
            history.push(`/${user.displayName}`);
          }}
        >
          Profile
        </button>
        <button type='button'>Liked</button>
        <button
          type='button'
          onClick={() => {
            closeDropDown();
            history.push('/settings');
          }}
        >
          Settings
        </button>
        <div className='sign-out'>
          <button
            type='button'
            onClick={() => {
              history.push('/');
              signOutUser();
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

DropDown.propTypes = {
  closeDropDown: PropTypes.func.isRequired,
};

export default DropDown;
