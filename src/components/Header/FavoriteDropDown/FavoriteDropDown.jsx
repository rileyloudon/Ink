import { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import { useHistory } from 'react-router-dom';
import './FavoriteDropDown.css';
import UserContext from '../../../Context/UserContext';

const FavoriteDropDown = ({ closeFavoriteDropDown }) => {
  // const history = useHistory();
  const { user } = useContext(UserContext);

  const favoriteDropDown = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        favoriteDropDown.current &&
        !favoriteDropDown.current.contains(e.target)
      )
        closeFavoriteDropDown();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeFavoriteDropDown]);

  return (
    <div className='favorite-drop-down-container'>
      <div ref={favoriteDropDown} className='favorite-drop-down'>
        {user.private && (
          <button
            type='button'
            onClick={() => {
              closeFavoriteDropDown();
              // history.push(Follower Requests URL);
            }}
          >
            {user.followRequests} Follow Requests
          </button>
        )}
        <button
          type='button'
          onClick={() => {
            closeFavoriteDropDown();
            // history.push(`New Likes since last login (?)`);
          }}
        >
          {user.newLikes} New Likes
        </button>
        <button
          type='button'
          onClick={() => {
            closeFavoriteDropDown();
            // history.push('New Followers since last login');
          }}
        >
          {user.newFollowers} New Followers
        </button>
      </div>
    </div>
  );
};

FavoriteDropDown.propTypes = {
  closeFavoriteDropDown: PropTypes.func.isRequired,
};

export default FavoriteDropDown;
