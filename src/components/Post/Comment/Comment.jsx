import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { fetchProfilePicture } from '../../../firebase';
import './Comment.css';

const Comment = ({ commentObj, includePicture }) => {
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
      {includePicture && (
        <Link to={`/${commentObj.by}`}>
          <img src={profilePicture} alt='' />
        </Link>
      )}
      <div>
        <Link to={`/${commentObj.by}`}>
          <span className='by'>{commentObj.by}</span>
        </Link>
        <span className='comment'>{commentObj.comment}</span>
      </div>
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
