import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
// import { signOutUser } from '../../firebase';
import { home, chat, add, favorite } from '../../img/index';
import UserContext from '../../Context/UserContext';
import './header.css';

const Header = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <header>
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
              src={activeTab === 'home' ? home.homeActive : home.homeNotActive}
              alt='Home'
            />
          </Link>
          <Link to='/chat' onClick={() => setActiveTab('chat')}>
            <img
              src={activeTab === 'chat' ? chat.chatActive : chat.chatNotActive}
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

          {/* onClick => Display Profile, Saved Pictures (?), Settings, Log Out */}
          <div className='profile-border'>
            <img className='profile-picture' src={user.photoURL} alt='' />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
