import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ReactComponent as Dots } from '../../../img/dots/dots.svg';
import PostDropDown from '../PostDropDown/PostDropDown';
import './Owner.css';

const Owner = ({ owner, profilePicture }) => {
  const [displayPostDropdown, setDisplayPostDropdown] = useState(false);

  const closePostDropdown = () => setDisplayPostDropdown(false);

  return (
    <section className='owner'>
      <Link to={`/${owner}`}>
        <img src={profilePicture} alt='' />
      </Link>
      <Link to={`/${owner}`}>
        <span>{owner}</span>
      </Link>
      <Dots
        className='dots'
        onClick={() =>
          displayPostDropdown
            ? setDisplayPostDropdown(false)
            : setDisplayPostDropdown(true)
        }
      />
      {displayPostDropdown && (
        <PostDropDown closePostDropdown={closePostDropdown} />
      )}
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
