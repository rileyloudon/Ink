import PropTypes from 'prop-types';
import { favorite, comment } from '../../../img';
import './ButtonBar.css';

const ButtonBar = ({ likeStatus, likePost, disableComments, postId }) => {
  return (
    <div className='icons'>
      <button type='button' onClick={likePost}>
        <img
          src={
            likeStatus.userLikes
              ? favorite.darkLikedFavorite
              : favorite.favoriteNotActive
          }
          alt=''
        />
      </button>
      {!disableComments && (
        <button
          type='button'
          onClick={() => document.getElementById(`${postId}-textarea`).focus()}
        >
          <img src={comment.darkTextOutline} alt='' />
        </button>
      )}
    </div>
  );
};

ButtonBar.propTypes = {
  likeStatus: PropTypes.bool.isRequired,
  disableComments: PropTypes.bool.isRequired,
  likePost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
};

export default ButtonBar;
