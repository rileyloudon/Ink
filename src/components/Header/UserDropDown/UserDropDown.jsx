import { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { signOutUser } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import './UserDropdown.css';

const UserDropdown = () => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const userDropdownRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleClick = () => setUserDropdownOpen(!userDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userDropdownRef.current !== null &&
        !userDropdownRef.current.contains(e.traget)
      ) {
        setUserDropdownOpen(!userDropdownOpen);
      }
    };

    if (userDropdownOpen) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [userDropdownOpen]);

  return (
    <div className='user-dropdown-container'>
      <button type='button' className='profile-border' onClick={handleClick}>
        <img className='profile-picture' src={user.photoURL} alt='' />
      </button>
      <div
        ref={userDropdownRef}
        className={`user-dropdown ${userDropdownOpen ? 'displayed' : ''}`}
      >
        <button
          type='button'
          onClick={() => {
            history.push(`/${user.username}`);
            window.scrollTo(0, 0);
          }}
        >
          Profile
        </button>
        <button
          type='button'
          onClick={() => {
            history.push(`/${user.username}/liked`);
            window.scrollTo(0, 0);
          }}
        >
          Liked
        </button>
        <button
          type='button'
          onClick={() => {
            history.push('/settings');
            window.scrollTo(0, 0);
          }}
        >
          Settings
        </button>
        <div className='sign-out'>
          <button
            type='button'
            onClick={() => signOutUser().then(() => history.push('/'))}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
