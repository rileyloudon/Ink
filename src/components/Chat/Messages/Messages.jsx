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
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import { ReactComponent as ChatOutline } from '../../../img/Header/chat-outline.svg';
import { ReactComponent as Back } from '../../../img/Chat/back.svg';
import { fetchAllowMessages } from '../../../firebase';
import './Messages.css';

const Messages = ({ currentSelectedUser, windowSize, updateActiveTab }) => {
  const db = getFirestore();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [prevMessages, setPrevMessages] = useState(null);
  const [allowMessages, setAllowMessages] = useState(null);
  const [disable, setDisable] = useState(false);

  const allowMessagesWarning = () => {
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

  const displayNoUser = () => {
    return (
      <div className='messages no-user'>
        <ChatOutline />
        <p>Search for a user to start chatting</p>
      </div>
    );
  };

  const displayCurrentUser = () => {
    return (
      <section className='messages'>
        {windowSize < 735 && (
          <Back className='back' onClick={() => updateActiveTab('selector')} />
        )}
        <Link
          to={`/${currentSelectedUser.username}`}
          key={currentSelectedUser.username}
        >
          <img src={currentSelectedUser.photoURL} alt='' />
          <span>{currentSelectedUser.username}</span>
        </Link>
        <div className='prev-messages'>
          {loading ? (
            <Spinner className='spinner' />
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
        {allowMessagesWarning()}
        <AddComment
          chat
          currentSelectedUser={currentSelectedUser.username}
          disable={disable}
        />
      </section>
    );
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
          allMessages.unshift(message.data());
        });
        setPrevMessages(...[allMessages]);
        setLoading(false);
      });
      return () => unsub();
    }

    return null;
  }, [currentSelectedUser, db, user]);

  return currentSelectedUser ? displayCurrentUser() : displayNoUser();
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
  windowSize: PropTypes.number.isRequired,
  updateActiveTab: PropTypes.func.isRequired,
};
