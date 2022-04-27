import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { fetchProfilePicture } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import CommentDropdown from '../CommentDropdown/CommentDropdown';
import './Comment.css';

const Comment = ({ post, commentObj, includePicture }) => {
  const { user } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState();
  const [style, setStyle] = useState({ display: 'none' });

  // sets to true if either are true, or false is both false
  const allowCommentDelete =
    user.username === commentObj.by || user.username === post.owner;

  useEffect(() => {
    let isSubscribed = true;

    if (includePicture) {
      (async () => {
        const res = await fetchProfilePicture(commentObj.by);
        if (isSubscribed) setProfilePicture(res);
      })();
    }

    return () => {
      isSubscribed = false;
    };
  }, [commentObj, includePicture]);

  return (
    <div
      className='commenter'
      onMouseEnter={() =>
        allowCommentDelete ? setStyle({ display: 'block' }) : null
      }
      onMouseLeave={() =>
        allowCommentDelete ? setStyle({ display: 'none' }) : null
      }
    >
      <Link to={`/${commentObj.by}`}>
        {includePicture && <img src={profilePicture} alt='' />}
        <span className='by'>{commentObj.by}</span>
      </Link>
      <span className='comment'>{commentObj.comment}</span>
      {allowCommentDelete && (
        <CommentDropdown post={post} comment={commentObj} style={style} />
      )}
    </div>
  );
};

Comment.defaultProps = {
  includePicture: true,
};

Comment.propTypes = {
  post: PropTypes.shape({
    owner: PropTypes.string.isRequired,
  }).isRequired,
  commentObj: PropTypes.shape({
    by: PropTypes.string,
    comment: PropTypes.string,
  }).isRequired,
  includePicture: PropTypes.bool,
};

export default Comment;
