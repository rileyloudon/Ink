import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AddComment from '../../Post/AddComment/AddComment';
import './Messages.css';

const Messages = ({ currentSelectedUser }) => {
  const [prevMessages] = useState(null);

  return (
    <div className='messages'>
      {currentSelectedUser ? (
        <Link
          to={`/${currentSelectedUser.username}`}
          key={currentSelectedUser.username}
        >
          <img src={currentSelectedUser.photoURL} alt='' />
          <span>{currentSelectedUser.username}</span>
        </Link>
      ) : (
        <p>No User Selected</p>
      )}
      <div className='prev-messages'>
        {prevMessages && prevMessages.map((message) => <p>{message}</p>)}
      </div>
      <AddComment chat />
    </div>
  );
};

export default Messages;

Messages.defaultProps = {
  currentSelectedUser: null,
};

Messages.propTypes = {
  currentSelectedUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
  }),
};
