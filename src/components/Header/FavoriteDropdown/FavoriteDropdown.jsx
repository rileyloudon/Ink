import { useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import { ReactComponent as FavoriteOutline } from '../../../img/shared/favorite-outline.svg';
import { ReactComponent as FavoriteFilled } from '../../../img/shared/favorite-filled.svg';
import './FavoriteDropdown.css';

const FavoriteDropdown = ({
  favoriteDropdownOpen,
  updateFavoriteDropdownOpen,
}) => {
  const { user } = useContext(UserContext);
  const favoriteDropdownRef = useRef(null);

  const handleClick = () => updateFavoriteDropdownOpen(!favoriteDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        favoriteDropdownRef.current !== null &&
        !favoriteDropdownRef.current.contains(e.traget)
      )
        updateFavoriteDropdownOpen(!favoriteDropdownOpen);
    };

    if (favoriteDropdownOpen)
      window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [favoriteDropdownOpen, updateFavoriteDropdownOpen]);

  return (
    <div className='favorite-dropdown-container'>
      {favoriteDropdownOpen ? (
        <FavoriteFilled onClick={handleClick} className='header-svg' />
      ) : (
        <FavoriteOutline onClick={handleClick} className='header-svg' />
      )}
      <div
        ref={favoriteDropdownRef}
        className={`favorite-dropdown ${
          favoriteDropdownOpen ? 'displayed' : ''
        }`}
      >
        {user.private && (
          <Link to='/account/follow-requests'>
            {user.followRequests} Follow Request
            {user.followRequests === 1 ? '' : 's'}
          </Link>
        )}
        <Link to='/account/new-likes'>
          {user.newLikes.length} New Like{user.newLikes.length === 1 ? '' : 's'}
        </Link>
        <Link to='/account/new-followers'>
          {user.newFollowers.length} New Follower
          {user.newFollowers.length === 1 ? '' : 's'}
        </Link>
      </div>
    </div>
  );
};

FavoriteDropdown.propTypes = {
  favoriteDropdownOpen: PropTypes.bool.isRequired,
  updateFavoriteDropdownOpen: PropTypes.func.isRequired,
};

export default FavoriteDropdown;
