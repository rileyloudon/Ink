import { signOutUser } from '../../firebase';
import './DropDown.css';

const DropDown = () => {
  return (
    <div className='user-drop-down'>
      <button type='button'>Profile</button>
      <button type='button'>Liked</button>
      <button type='button'>Settings</button>
      <div className='sign-out'>
        <button type='button' onClick={signOutUser}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DropDown;
