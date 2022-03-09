import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import FavoriteDropdown from './FavoriteDropdown/FavoriteDropdown';
import UserDropdown from './UserDropdown/UserDropdown';
import { ReactComponent as HomeOutline } from '../../img/home/home-outline.svg';
import { ReactComponent as HomeFilled } from '../../img/home/home-filled.svg';
import { ReactComponent as ChatOutline } from '../../img/chat/chat-outline.svg';
import { ReactComponent as ChatFilled } from '../../img/chat/chat-filled.svg';
import { ReactComponent as AddOutline } from '../../img/add/add-outline.svg';
import { ReactComponent as AddFilled } from '../../img/add/add-filled.svg';
import Search from './Search/Search';
import './header.css';

const Header = ({ updateAddModal, showAddModal }) => {
  const location = useLocation();
  const [favoriteDropdownOpen, setFavoriteDropdownOpen] = useState(false);

  const changeFavoriteDropdownOpen = (value) => setFavoriteDropdownOpen(value);

  return (
    <header>
      <div className='center-header'>
        <div className='header-background' />
        <div className='header-container'>
          <Link to='/' className='title'>
            <p className='ink'>Ink</p>
          </Link>
          <Search />
          <div className='nav'>
            <Link to='/'>
              {location.pathname === '/' &&
              !showAddModal &&
              !favoriteDropdownOpen ? (
                <HomeFilled />
              ) : (
                <HomeOutline />
              )}
            </Link>
            <Link to='/chat'>
              {location.pathname === '/chat' &&
              !showAddModal &&
              !favoriteDropdownOpen ? (
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
              {showAddModal ? <AddFilled /> : <AddOutline />}
            </button>

            {/* onClick -> Display follow requests, likes, setActiveTab('favorite') */}
            <FavoriteDropdown
              favoriteDropdownOpen={favoriteDropdownOpen}
              changeFavoriteDropdownOpen={changeFavoriteDropdownOpen}
            />
            <UserDropdown />
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
