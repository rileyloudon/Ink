import { useState } from 'react';
import UserSelector from './UserSelector/UserSelector';
import Messages from './Messages/Messages';
import './Chat.css';

const Chat = () => {
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);

  const updateCurrentSelectedUser = (value) => setCurrentSelectedUser(value);

  return (
    <div className='chat'>
      <UserSelector
        currentSelectedUser={currentSelectedUser}
        updateCurrentSelectedUser={updateCurrentSelectedUser}
      />
      <Messages currentSelectedUser={currentSelectedUser} />
    </div>
  );
};

export default Chat;
