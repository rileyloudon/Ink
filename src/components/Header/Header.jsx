import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DropDown from '../DropDown/DropDown';
import { home, chat, add, favorite } from '../../img/index';
import UserContext from '../../Context/UserContext';
import './header.css';

const Header = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [activeTab] = useState();

  const [displayUserDropdown, setDisplayUserDropdown] = useState(false);
  const closeDropDown = () => setDisplayUserDropdown(false);

  return (
    <header>
      <div className='center-header'>
        <div className='header-container'>
          <Link to='/' className='title'>
            <p className='ink'>Ink</p>
          </Link>

          <input
            className='search-box'
            type='text'
            placeholder='Search'
            autoCapitalize='none'
          />

          <div className='nav'>
            <Link to='/'>
              <img
                src={
                  location.pathname === '/' &&
                  !displayUserDropdown &&
                  (activeTab !== 'add' || activeTab !== 'favorite')
                    ? home.homeActive
                    : home.homeNotActive
                }
                alt='Home'
              />
            </Link>
            <Link to='/chat'>
              <img
                src={
                  location.pathname === '/chat' &&
                  !displayUserDropdown &&
                  (activeTab !== 'add' || activeTab !== 'favorite')
                    ? chat.chatActive
                    : chat.chatNotActive
                }
                alt='Chat'
              />
            </Link>

            {/* onClick -> Pop up modal, setActiveTab('add') */}
            <img
              src={activeTab === 'add' ? add.addActive : add.addNotActive}
              alt='Add'
            />

            {/* onClick -> Display follow requests, likes, setActiveTab('favorite') */}
            <img
              src={
                activeTab === 'favorite'
                  ? favorite.favoriteActive
                  : favorite.favoriteNotActive
              }
              alt='Heart'
            />

            <button
              className='profile-border'
              type='button'
              onClick={() => {
                if (displayUserDropdown) setDisplayUserDropdown(false);
                else setDisplayUserDropdown(true);
              }}
            >
              <img className='profile-picture' src={user.photoURL} alt='' />
            </button>
            {displayUserDropdown && <DropDown closeDropDown={closeDropDown} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
