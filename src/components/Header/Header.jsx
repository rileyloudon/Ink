import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import DropDown from './DropDown/DropDown';
import { ReactComponent as HomeOutline } from '../../img/home/home-outline.svg';
import { ReactComponent as HomeFilled } from '../../img/home/home-filled.svg';
import { ReactComponent as ChatOutline } from '../../img/chat/chat-outline.svg';
import { ReactComponent as ChatFilled } from '../../img/chat/chat-filled.svg';
import { ReactComponent as AddOutline } from '../../img/add/add-outline.svg';
import { ReactComponent as AddFilled } from '../../img/add/add-filled.svg';
import { ReactComponent as FavoriteOutline } from '../../img/favorite/favorite-outline.svg';
import { ReactComponent as FavoriteFilled } from '../../img/favorite/favorite-filled.svg';

import UserContext from '../../Context/UserContext';
import './header.css';

const Header = ({ updateAddModal, showAddModal }) => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [activeTab] = useState();

  const [displayUserDropdown, setDisplayUserDropdown] = useState(false);
  const closeDropDown = () => setDisplayUserDropdown(false);

  return (
    <header>
      <div className='center-header'>
        <div className='header-white-background' />
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
              {location.pathname === '/' &&
              !displayUserDropdown &&
              !showAddModal ? (
                <HomeFilled />
              ) : (
                <HomeOutline />
              )}
            </Link>
            <Link to='/chat'>
              {location.pathname === '/chat' &&
              !displayUserDropdown &&
              !showAddModal ? (
                <ChatFilled />
              ) : (
                <ChatOutline />
              )}
            </Link>

            <button
              type='button'
              className='add'
              onClick={() => updateAddModal(true)}
            >
              {!displayUserDropdown && showAddModal ? (
                <AddFilled />
              ) : (
                <AddOutline />
              )}
            </button>

            {/* onClick -> Display follow requests, likes, setActiveTab('favorite') */}
            {activeTab === 'favorite' ? (
              <FavoriteFilled />
            ) : (
              <FavoriteOutline />
            )}

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

Header.propTypes = {
  updateAddModal: PropTypes.func.isRequired,
  showAddModal: PropTypes.bool.isRequired,
};

export default Header;
