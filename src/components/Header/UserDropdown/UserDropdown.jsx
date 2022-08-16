import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signOutUser } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import ThemeContext from '../../../Context/ThemeContext';
import { ReactComponent as ProfileSvg } from '../../../img/UserDropdown/profile.svg';
import { ReactComponent as LikedSvg } from '../../../img/UserDropdown/favorite-small.svg';
import { ReactComponent as ThemeSvg } from '../../../img/UserDropdown/theme.svg';
import { ReactComponent as SettingsSvg } from '../../../img/UserDropdown/settings.svg';
import './UserDropdown.css';

const UserDropdown = () => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const userDropdownRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleClick = () => setUserDropdownOpen(!userDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userDropdownRef.current !== null &&
        !userDropdownRef.current.contains(e.traget) &&
        !e.target.classList.contains('profile-picture')
      )
        setUserDropdownOpen(!userDropdownOpen);
    };

    if (userDropdownOpen) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [userDropdownOpen]);

  return (
    <div className='user-dropdown-container'>
      <button type='button' className='profile-border' onClick={handleClick}>
        <img className='profile-picture' src={user.photoURL} alt='' />
      </button>
      {userDropdownOpen && (
        <div ref={userDropdownRef} className='user-dropdown'>
          <Link to={`/${user.username}`} onClick={() => window.scrollTo(0, 0)}>
            <ProfileSvg className='user-dropdown-svg' />
            Profile
          </Link>
          <Link to='/account/liked' onClick={() => window.scrollTo(0, 0)}>
            <LikedSvg className='user-dropdown-svg' />
            Liked
          </Link>
          <button
            type='button'
            onClick={() => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
              localStorage.setItem('theme', newTheme);
            }}
          >
            <ThemeSvg className='user-dropdown-svg' />
            Toggle Theme
          </button>
          <Link
            to='/account/settings'
            type='button'
            onClick={() => window.scrollTo(0, 0)}
          >
            <SettingsSvg className='user-dropdown-svg' />
            Settings
          </Link>
          <div className='sign-out'>
            <button
              type='button'
              onClick={() => signOutUser().then(() => history.push('/'))}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
