import { PropTypes } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import './Caption.css';

const Caption = ({ owner, photoURL, caption }) => {
  return caption.length > 1 ? (
    <div className='caption'>
      {photoURL && (
        <Link to={`/${owner}`}>
          <img src={photoURL} alt='' />
        </Link>
      )}
      <div>
        <Link to={`/${owner}`}>
          <span className='post-owner'>{owner}</span>
        </Link>
        <span className='post-caption'>{caption}</span>
      </div>
    </div>
  ) : null;
};

Caption.defaultProps = {
  photoURL: null,
};

Caption.propTypes = {
  owner: PropTypes.string.isRequired,
  photoURL: PropTypes.string,
  caption: PropTypes.string.isRequired,
};

export default Caption;
