import PropTypes from 'prop-types';
import { useContext, useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import { ReactComponent as Dots } from '../../../img/dots/dots.svg';
import './PostDropdown.css';

const PostDropdown = ({ owner, id, linkObject }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const postDropDownRef = useRef(null);
  const [postDropdownOpen, setPostDropdownOpen] = useState(false);

  const handleClick = () => setPostDropdownOpen(!postDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        postDropDownRef.current !== null &&
        !postDropDownRef.current.contains(e.traget) &&
        !e.target.classList.contains('post-dots')
      )
        setPostDropdownOpen(!postDropdownOpen);
    };

    if (postDropdownOpen) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [postDropdownOpen]);

  return (
    <div className='post-dropdown-container'>
      <button type='button' className='post-dots' onClick={handleClick}>
        <Dots className='dots' />
      </button>
      {postDropdownOpen && (
        <div ref={postDropDownRef} className='post-dropdown'>
          {location.pathname === '/' && <Link to={linkObject}>View Post</Link>}
          {owner === user.username && (
            <Link to={`/account/${id}/edit`}>Edit Post</Link>
          )}
        </div>
      )}
    </div>
  );
};

PostDropdown.defaultProps = {
  linkObject: null,
};

PostDropdown.propTypes = {
  owner: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  linkObject: PropTypes.shape({}),
};

export default PostDropdown;
