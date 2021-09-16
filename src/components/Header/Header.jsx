import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { home, chat, add, favorite } from '../../img/index';
import octopus from '../../img/misc/octopus-small.png';
import './header.css';

const Header = ({ active }) => (
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
        <Link to='/'>
          <img
            src={active === 'home' ? home.homeActive : home.homeNotActive}
            alt='Home'
          />
        </Link>
        <Link to='/chat'>
          <img
            src={active === 'chat' ? chat.chatActive : chat.chatNotActive}
            alt='Chat'
          />
        </Link>

        {/* onClick -> Pop up modal */}
        <img
          src={active === 'add' ? add.addActive : add.addNotActive}
          alt='Add'
        />

        {/* onClick -> Display follow requests, likes */}
        <img
          src={
            active === 'favorite'
              ? favorite.favoriteActive
              : favorite.favoriteNotActive
          }
          alt='Heart'
        />

        {/* Change src to users profile picture */}
        <div className='profile-border'>
          <img className='profile-picture' src={octopus} alt='' />
        </div>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  active: PropTypes.string.isRequired,
  // profile-picture: PropTypes.string.isRequired
};

export default Header;
