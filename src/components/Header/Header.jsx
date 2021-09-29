import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import DropDown from '../DropDown/DropDown';
import { home, chat, add, favorite } from '../../img/index';
import UserContext from '../../Context/UserContext';
import './header.css';

const Header = () => {
  const { user } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState('home');

  const [displayUserDropdown, setDisplayUserDropdown] = useState(false);
  const closeDropDown = () => setDisplayUserDropdown(false);

  return (
    <header>
      <div className='center-header'>
        <div className='header-container'>
          <p className='ink title'>Ink</p>

          <input
            className='search-box'
            type='text'
            placeholder='Search'
            autoCapitalize='none'
          />

          <div className='nav'>
            <Link to='/' onClick={() => setActiveTab('home')}>
              <img
                src={
                  activeTab === 'home' && !displayUserDropdown
                    ? home.homeActive
                    : home.homeNotActive
                }
                alt='Home'
              />
            </Link>
            <Link to='/chat' onClick={() => setActiveTab('chat')}>
              <img
                src={
                  activeTab === 'chat' && !displayUserDropdown
                    ? chat.chatActive
                    : chat.chatNotActive
                }
                alt='Chat'
              />
            </Link>

            {/* onClick -> Pop up modal */}
            <img
              src={activeTab === 'add' ? add.addActive : add.addNotActive}
              alt='Add'
            />

            {/* onClick -> Display follow requests, likes */}
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
              onClick={() =>
                displayUserDropdown
                  ? setDisplayUserDropdown(false)
                  : setDisplayUserDropdown(true)
              }
            >
              <img className='profile-picture' src={user.photoURL} alt='' />
            </button>
          </div>
        </div>
      </div>
      {displayUserDropdown && <DropDown closeDropDown={closeDropDown} />}
    </header>
  );
};

export default Header;
