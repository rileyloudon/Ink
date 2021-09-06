import { Link } from 'react-router-dom';
import home from '../img/home_black_24dp.svg';
import chat from '../img/forum_black_24dp.svg';
import add from '../img/add_a_photo_black_24dp.svg';
import heart from '../img/favorite_border_black_24dp.svg';

const Header = () => {
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
          <Link to='/'>
            <img src={home} alt='Home' />
          </Link>
          <Link to='/inbox'>
            <img src={chat} alt='Chat' />
          </Link>

          {/* onClick -> Pop up modal */}
          <img src={add} alt='Add' />

          {/* onClick -> Display follow requests */}
          <img src={heart} alt='Heart' />
        </div>

        {/* <img src={FIREBASE USER PROFILE PICTURE} alt='' /> */}
      </div>
    </header>
  );
};

export default Header;
