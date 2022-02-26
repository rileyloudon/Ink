import { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import { ReactComponent as FavoriteOutline } from '../../../img/favorite/favorite-outline.svg';
import { ReactComponent as FavoriteFilled } from '../../../img/favorite/favorite-filled.svg';
import './FavoriteDropdown.css';

const FavoriteDropdown = ({
  favoriteDropdownOpen,
  changeFavoriteDropdownOpen,
}) => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const favoriteDropdown = useRef();

  const handleClickOutside = (e) => {
    console.log('Post Dropdown Closed');
    if (
      favoriteDropdown.current &&
      !favoriteDropdown.current.contains(e.target) &&
      e.target.tagName !== 'svg' &&
      e.target.tagName !== 'path' &&
      document
        .getElementById(`favorite-dropdown`)
        .classList.contains('displayed')
    ) {
      document
        .getElementById(`favorite-dropdown`)
        .classList.remove('displayed');
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  const handleClick = () => {
    // Copy and pasted from the other dropdowns but this one doesnt work.
    // once: true helps fix the problem for now
    // event listener doesn't get deleted when clicking the icon or a dropdown button
    // but does when clicking outside using handleClickOutside
    const dropdown = document.getElementById(`favorite-dropdown`);

    if (dropdown.classList.contains('displayed')) {
      document.removeEventListener('mousedown', handleClickOutside);
    } else
      document.addEventListener('mousedown', handleClickOutside, {
        once: true,
      });
    dropdown.classList.toggle('displayed');
    changeFavoriteDropdownOpen((oldState) => !oldState);
  };

  const removeEverything = () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.getElementById(`favorite-dropdown`).classList.remove('displayed');
    changeFavoriteDropdownOpen(false);
  };

  return (
    <div ref={favoriteDropdown} className='favorite-dropdown-container'>
      {favoriteDropdownOpen ? (
        <FavoriteFilled onClick={handleClick} />
      ) : (
        <FavoriteOutline onClick={handleClick} />
      )}
      <div id='favorite-dropdown'>
        {user.private && (
          <button
            type='button'
            onClick={() => {
              removeEverything();
              history.push('/settings/follow-requests');
            }}
          >
            {user.followRequests} Follow Request
            {user.followRequests === 1 ? '' : 's'}
          </button>
        )}
        <button
          type='button'
          onClick={() => {
            removeEverything();
            // history.push(`New Likes since last login (?)`);
          }}
        >
          {user.newLikes} New Like{user.newLikes === 1 ? '' : 's'}
        </button>
        <button
          type='button'
          onClick={() => {
            removeEverything();
            // history.push('New Followers since last login');
          }}
        >
          {user.newFollowers} New Follower{user.newFollowers === 1 ? '' : 's'}
        </button>
      </div>
    </div>
  );
};

FavoriteDropdown.propTypes = {
  favoriteDropdownOpen: PropTypes.bool.isRequired,
  changeFavoriteDropdownOpen: PropTypes.func.isRequired,
};

export default FavoriteDropdown;
