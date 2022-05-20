import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  getFirestore,
  onSnapshot,
  collection,
  orderBy,
  query,
} from 'firebase/firestore';
import AddComment from '../../Post/AddComment/AddComment';
import UserContext from '../../../Context/UserContext';
import './Messages.css';

const Messages = ({ currentSelectedUser }) => {
  const db = getFirestore();
  const { user } = useContext(UserContext);

  const [prevMessages, setPrevMessages] = useState(null);

  useEffect(() => {
    if (user && currentSelectedUser) {
      const q = query(
        collection(
          db,
          'users',
          user.username,
          'chat',
          currentSelectedUser.username,
          'messages'
        ),
        orderBy('date', 'asc')
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        const allMessages = [];
        querySnapshot.forEach((message) => {
          allMessages.push(message.data());
        });
        setPrevMessages(...[allMessages]);
      });
      return () => unsub();
    }

    return null;
  }, [currentSelectedUser, db, user]);

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
        {prevMessages &&
          prevMessages.map((m) => (
            <p
              className={m.from === user.username ? 'blue' : 'grey'}
              key={m.date + m.message}
            >
              {m.message}
            </p>
          ))}
      </div>
      {currentSelectedUser && (
        <AddComment chat currentSelectedUser={currentSelectedUser.username} />
      )}
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
