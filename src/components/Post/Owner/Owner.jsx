import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Owner.css';

const Owner = ({ owner, profilePicture }) => {
  return (
    <section className='owner'>
      <Link to={`/${owner}`}>
        <img src={profilePicture} alt='' />
      </Link>
      <Link to={`/${owner}`}>
        <span>{owner}</span>
      </Link>
    </section>
  );
};

Owner.defaultProps = {
  profilePicture: null,
};

Owner.propTypes = {
  owner: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
};

export default Owner;
