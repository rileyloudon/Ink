import { useState, useEffect, useContext } from 'react';
import Loading from '../Loading/Loading';
import UserSelector from './UserSelector/UserSelector';
import Messages from './Messages/Messages';
import { fetchLatestChatUsers } from '../../firebase';
import UserContext from '../../Context/UserContext';
import './Chat.css';

const Chat = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);
  const [pastChats, setPastChats] = useState(null);

  const updateCurrentSelectedUser = (value) => setCurrentSelectedUser(value);
  const updatePastChats = (value) => setPastChats(value);

  useEffect(() => {
    let isSubscribed = true;

    if (user) {
      (async () => {
        // res returns an object: users & profilePictures
        // thry will be in the same order so users[0] goes with profilePictures[0]
        const res = await fetchLatestChatUsers();
        if (isSubscribed) {
          setPastChats(res);
          setLoading(false);
        }
      })();
    }

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  return loading ? (
    <Loading />
  ) : (
    <div className='chat'>
      <UserSelector
        currentSelectedUser={currentSelectedUser}
        updateCurrentSelectedUser={updateCurrentSelectedUser}
        pastChats={pastChats}
        updatePastChats={updatePastChats}
      />
      <Messages currentSelectedUser={currentSelectedUser} />
    </div>
  );
};

export default Chat;
