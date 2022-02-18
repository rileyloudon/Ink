import { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import './FavoriteDropdown.css';

const FavoriteDropdown = ({ closeFavoriteDropdown }) => {
  const history = useHistory();
  const { user } = useContext(UserContext);

  const favoriteDropdown = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        favoriteDropdown.current &&
        !favoriteDropdown.current.contains(e.target)
      )
        closeFavoriteDropdown();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeFavoriteDropdown]);

  return (
    <div className='favorite-dropdown-container'>
      <div ref={favoriteDropdown} className='favorite-dropdown'>
        {user.private && (
          <button
            type='button'
            onClick={() => {
              closeFavoriteDropdown();
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
            closeFavoriteDropdown();
            // history.push(`New Likes since last login (?)`);
          }}
        >
          {user.newLikes} New Like{user.newLikes === 1 ? '' : 's'}
        </button>
        <button
          type='button'
          onClick={() => {
            closeFavoriteDropdown();
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
  closeFavoriteDropdown: PropTypes.func.isRequired,
};

export default FavoriteDropdown;
