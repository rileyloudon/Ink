import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { fetchProfilePicture } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import CommentDropdown from '../CommentDropdown/CommentDropdown';
import './Comment.css';

const Comment = ({ commentObj, includePicture }) => {
  const { user } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState();

  useEffect(() => {
    let isSubscribed = true;
    if (includePicture) {
      fetchProfilePicture(commentObj.by).then((res) => {
        if (isSubscribed) setProfilePicture(res);
      });
    }
    return () => {
      isSubscribed = false;
    };
  }, [commentObj, includePicture]);

  return (
    <div className='commenter'>
      <Link to={`/${commentObj.by}`}>
        {includePicture && <img src={profilePicture} alt='' />}
        <span className='by'>{commentObj.by}</span>
      </Link>
      <span className='comment'>{commentObj.comment}</span>
      {user.username === commentObj.by && (
        <CommentDropdown comment={commentObj} />
      )}
    </div>
  );
};

Comment.defaultProps = {
  includePicture: true,
};

Comment.propTypes = {
  commentObj: PropTypes.shape({
    by: PropTypes.string,
    comment: PropTypes.string,
  }).isRequired,
  includePicture: PropTypes.bool,
};

export default Comment;
