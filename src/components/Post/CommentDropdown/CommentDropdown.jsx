import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { ReactComponent as Dots } from '../../../img/dots/dots.svg';
import './CommentDropdown.css';

const CommentDropdown = ({ comment, style }) => {
  const commentDropdownRef = useRef(null);
  const [commentDropdownOpen, setCommentDropdownOpen] = useState(false);

  const handleClick = () => setCommentDropdownOpen(!commentDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        commentDropdownRef.current !== null &&
        !commentDropdownRef.current.contains(e.traget)
      ) {
        setCommentDropdownOpen(!commentDropdownOpen);
      }
    };

    if (commentDropdownOpen)
      window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [commentDropdownOpen]);

  return (
    <div className='comment-dropdown-container' style={style}>
      <Dots className='dots' onClick={handleClick} />
      <div
        ref={commentDropdownRef}
        className={`comment-dropdown ${commentDropdownOpen ? 'displayed' : ''}`}
      >
        <button
          type='button'
          onClick={() => {
            // Delete Comment
            console.log(comment);
          }}
        >
          Delete Comment
        </button>
      </div>
    </div>
  );
};

CommentDropdown.propTypes = {
  comment: PropTypes.shape({}).isRequired,
  style: PropTypes.shape({}).isRequired,
};

export default CommentDropdown;
