import PropTypes from 'prop-types';
import './Likes.css';

const Likes = ({ likeCount }) => {
  const likesString = () => {
    if (likeCount >= 1) return `${likeCount} like${likeCount === 1 ? '' : 's'}`;
    return 'Be the first to like this';
  };

  return (
    <div className='likes'>
      <p>{likesString()}</p>
    </div>
  );
};

Likes.propTypes = {
  likeCount: PropTypes.number.isRequired,
};

export default Likes;
