import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { deleteComment } from '../../../firebase';
import { ReactComponent as Dots } from '../../../img/dots/dots.svg';
import './CommentDropdown.css';

const CommentDropdown = ({ post, comment, style, deleteDisplayedComment }) => {
  const commentDropdownRef = useRef(null);
  const [commentDropdownOpen, setCommentDropdownOpen] = useState(true);

  const handleClick = () => setCommentDropdownOpen(!commentDropdownOpen);

  const deleteSelectedComment = async () => {
    deleteDisplayedComment(comment);
    await deleteComment(post, comment);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        commentDropdownRef.current !== null &&
        !commentDropdownRef.current.contains(e.traget) &&
        !e.target.classList.contains('comment-dots')
      )
        setCommentDropdownOpen(!commentDropdownOpen);
    };

    if (commentDropdownOpen)
      window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [commentDropdownOpen]);

  useEffect(() => {
    if (style.display === 'none') setCommentDropdownOpen(false);
  }, [style]);

  return (
    <div className='comment-dropdown-container' style={style}>
      <button type='button' className='comment-dots' onClick={handleClick}>
        <Dots className='dots' />
      </button>
      {commentDropdownOpen && (
        <div ref={commentDropdownRef} className='comment-dropdown'>
          <button type='button' onClick={() => deleteSelectedComment()}>
            Delete Comment
          </button>
        </div>
      )}
    </div>
  );
};

CommentDropdown.propTypes = {
  post: PropTypes.shape({}).isRequired,
  comment: PropTypes.shape({}).isRequired,
  style: PropTypes.shape({
    display: PropTypes.string.isRequired,
  }).isRequired,
  deleteDisplayedComment: PropTypes.func.isRequired,
};

export default CommentDropdown;
