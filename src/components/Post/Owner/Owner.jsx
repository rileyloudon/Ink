import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import PostDropdown from '../PostDropdown/PostDropdown';
import './Owner.css';

const Owner = ({ owner, profilePicture, id, linkObject }) => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  return (
    <section className='owner'>
      <Link to={`/${owner}`}>
        <img src={profilePicture} alt='' />
        <span>{owner}</span>
      </Link>
      {(location.pathname === '/' || owner === user.username) && (
        <PostDropdown owner={owner} id={id} linkObject={linkObject} />
      )}
    </section>
  );
};

Owner.defaultProps = {
  profilePicture: null,
  linkObject: null,
};

Owner.propTypes = {
  owner: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
  id: PropTypes.string.isRequired,
  linkObject: PropTypes.shape({}),
};

export default Owner;
