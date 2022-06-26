import { PropTypes } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import './Caption.css';

const Caption = ({ owner, photoURL, caption }) => {
  return caption.length > 1 ? (
    <section className='caption'>
      <Link to={`/${owner}`}>
        {photoURL && <img src={photoURL} alt='' />}
        <span className='post-owner'>{owner}</span>
      </Link>
      <span className='post-caption'>{caption}</span>
    </section>
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
