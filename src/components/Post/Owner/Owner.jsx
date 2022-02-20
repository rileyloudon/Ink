import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PostDropdown from '../PostDropDown/PostDropdown';
import './Owner.css';

const Owner = ({ owner, profilePicture, id }) => {
  return (
    <section className='owner'>
      <Link to={`/${owner}`}>
        <img src={profilePicture} alt='' />
      </Link>
      <Link to={`/${owner}`}>
        <span>{owner}</span>
      </Link>
      <PostDropdown id={id} />
    </section>
  );
};

Owner.defaultProps = {
  profilePicture: null,
};

Owner.propTypes = {
  owner: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default Owner;
