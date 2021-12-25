import PropTypes from 'prop-types';
import { ReactComponent as FavoriteNotLiked } from '../../../img/favorite/favorite-outline.svg';
import { ReactComponent as FavoriteLiked } from '../../../img/favorite/favorite-liked.svg';
import { ReactComponent as CommentOutline } from '../../../img/comment/comment-outline.svg';
import './ButtonBar.css';

const ButtonBar = ({ userLikes, likePost, disableComments, postId }) => {
  return (
    <div className='icons'>
      <button type='button' onClick={likePost}>
        {userLikes ? <FavoriteLiked /> : <FavoriteNotLiked />}
      </button>
      {!disableComments && (
        <button
          type='button'
          onClick={() => document.getElementById(`${postId}-textarea`).focus()}
        >
          <CommentOutline />
        </button>
      )}
    </div>
  );
};

ButtonBar.propTypes = {
  userLikes: PropTypes.bool.isRequired,
  disableComments: PropTypes.bool.isRequired,
  likePost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
};

export default ButtonBar;
