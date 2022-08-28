import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import FavoriteDropdown from './FavoriteDropdown/FavoriteDropdown';
import UserDropdown from './UserDropdown/UserDropdown';
import Search from '../Search/Search';
import { ReactComponent as HomeOutline } from '../../img/Header/home-outline.svg';
import { ReactComponent as HomeFilled } from '../../img/Header/home-filled.svg';
import { ReactComponent as ChatOutline } from '../../img/Header/chat-outline.svg';
import { ReactComponent as ChatFilled } from '../../img/Header/chat-filled.svg';
import { ReactComponent as AddOutline } from '../../img/Header/add-outline.svg';
import { ReactComponent as AddFilled } from '../../img/Header/add-filled.svg';
import './Header.css';

const Header = ({ updateAddModal, showAddModal }) => {
  const location = useLocation();
  const [favoriteDropdownOpen, setFavoriteDropdownOpen] = useState(false);

  const updateFavoriteDropdownOpen = (value) => setFavoriteDropdownOpen(value);

  return (
    <div className='center-header'>
      <div className='header-background' />
      <header className='header-container'>
        <h1 className='title'>
          <Link to='/' className='ink' onClick={() => window.scrollTo(0, 0)}>
            Ink
          </Link>
        </h1>
        <Search />
        <nav className='nav'>
          <Link to='/' onClick={() => window.scrollTo(0, 0)}>
            {location.pathname === '/' &&
            !showAddModal &&
            !favoriteDropdownOpen ? (
              <HomeFilled className='header-svg' />
            ) : (
              <HomeOutline className='header-svg' />
            )}
          </Link>
          <Link to='/direct/chat' onClick={() => window.scrollTo(0, 0)}>
            {location.pathname === '/direct/chat' &&
            !showAddModal &&
            !favoriteDropdownOpen ? (
              <ChatFilled className='header-svg' />
            ) : (
              <ChatOutline className='header-svg' />
            )}
          </Link>

          <button
            type='button'
            className='add'
            aria-label='Add Photo'
            onClick={() => updateAddModal(true)}
          >
            {showAddModal ? (
              <AddFilled className='header-svg' />
            ) : (
              <AddOutline className='header-svg' />
            )}
          </button>

          <FavoriteDropdown
            favoriteDropdownOpen={favoriteDropdownOpen}
            updateFavoriteDropdownOpen={updateFavoriteDropdownOpen}
          />
          <UserDropdown />
        </nav>
      </header>
    </div>
  );
};

Header.propTypes = {
  updateAddModal: PropTypes.func.isRequired,
  showAddModal: PropTypes.bool.isRequired,
};

export default Header;
