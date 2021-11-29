import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getProfilePicture } from '../../firebase';
import './Comment.css';

const Comment = ({ commentObj }) => {
  const [profilePicture, setProfilePicture] = useState();

  useEffect(() => {
    getProfilePicture(commentObj.by).then((res) => setProfilePicture(res));
  }, [commentObj]);

  return (
    <div className='commenter'>
      <Link to={`/${commentObj.by}`}>
        <img src={profilePicture} alt='' />
      </Link>
      <Link to={`/${commentObj.by}`}>
        <span>{commentObj.by}</span>
      </Link>
      <p>{commentObj.comment}</p>
    </div>
  );
};

Comment.propTypes = {
  commentObj: PropTypes.shape({
    by: PropTypes.string,
    comment: PropTypes.string,
  }).isRequired,
};

export default Comment;
