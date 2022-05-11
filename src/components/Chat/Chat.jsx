import { useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import UserSelector from './UserSelector/UserSelector';
import Messages from './Messages/Messages';
import './Chat.css';

const Chat = ({ loading }) => {
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);

  const updateCurrentSelectedUser = (value) => setCurrentSelectedUser(value);

  return loading ? (
    <Loading />
  ) : (
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

Chat.propTypes = {
  loading: PropTypes.bool.isRequired,
};
