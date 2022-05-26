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
import Loading from '../../Loading/Loading';
import { fetchAllowMessages } from '../../../firebase';
import './Messages.css';

const Messages = ({ currentSelectedUser }) => {
  const db = getFirestore();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [prevMessages, setPrevMessages] = useState(null);
  const [allowMessages, setAllowMessages] = useState(null);
  const [disable, setDisable] = useState(false);

  const allowMessagesWarning = () => {
    // allow user to reply if first sent a message by someone with restricive chat
    if (allowMessages && allowMessages.allow === false) {
      if (allowMessages.reason === 'not-following') {
        return (
          <p className='blocked-messages'>
            {currentSelectedUser.username} only allows messages from their
            followers.
          </p>
        );
      }

      if (allowMessages.reason === 'messages-disabled') {
        return (
          <p className='blocked-messages'>
            {currentSelectedUser.username} has disabled their messages.
          </p>
        );
      }
    }

    return null;
  };

  useEffect(() => {
    if (allowMessages && allowMessages.allow === false) setDisable(true);
    return () => setDisable(false);
  }, [allowMessages]);

  useEffect(() => {
    if (currentSelectedUser) {
      (async () => {
        const allowMessageStatus = await fetchAllowMessages(
          currentSelectedUser.username
        );
        setAllowMessages(allowMessageStatus);
      })();
    }
  }, [currentSelectedUser]);

  useEffect(() => {
    if (user && currentSelectedUser) {
      setLoading(true);
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
        setLoading(false);
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
        {loading ? (
          <Loading />
        ) : (
          prevMessages.map((m) => (
            <p
              className={m.from === user.username ? 'blue' : 'grey'}
              key={m.date + m.message}
            >
              {m.message}
            </p>
          ))
        )}
      </div>
      {currentSelectedUser && allowMessagesWarning()}
      {currentSelectedUser && (
        <AddComment
          chat
          currentSelectedUser={currentSelectedUser.username}
          disable={disable}
        />
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
