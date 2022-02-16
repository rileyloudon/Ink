import { useEffect, useState } from 'react';
import { changePassword } from '../../../firebase';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import './ChangePassword.css';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [error, setError] = useState();

  const [buttonLoading, setButtonLoading] = useState(false);

  const changedData =
    currentPassword !== '' || newPassword !== '' || newPassword2 !== '';

  const formValid =
    currentPassword && newPassword && newPassword2 && newPassword.length >= 6;

  const savePassword = async () => {
    setButtonLoading(true);
    if (newPassword !== newPassword2) {
      setError(`Your new passwords don't match`);
      setButtonLoading(false);
    } else {
      const status = await changePassword(currentPassword, newPassword);
      if (status === true) {
        setCurrentPassword('');
        setNewPassword('');
        setNewPassword2('');
        setError('');
        setPasswordUpdated(true);
      } else {
        setError(status);
        setPasswordUpdated(false);
      }
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    if (changedData) setPasswordUpdated(false);
  }, [changedData]);

  return (
    <div className='change-password'>
      <form>
        <h3>Change Password</h3>
        <label htmlFor='current-password' className='input'>
          <p>Current Password</p>
          <input
            type='password'
            id='current-password'
            name='current-password'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label htmlFor='new-password' className='input'>
          <p>New Password</p>
          <input
            type='password'
            id='new-password'
            name='new-password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label htmlFor='new-password2' className='input'>
          <p>Retype New Password</p>
          <input
            type='password'
            id='new-password2'
            name='new-password2'
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />
        </label>
        {error && <p className='error'>{error}</p>}
        {passwordUpdated && (
          <p className='password-updated'>Password Updated</p>
        )}
        <button
          className='save'
          type='button'
          disabled={!formValid}
          onClick={savePassword}
        >
          {!buttonLoading ? 'Save' : 'Saving'}
          {buttonLoading && <Spinner className='spinner' />}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
