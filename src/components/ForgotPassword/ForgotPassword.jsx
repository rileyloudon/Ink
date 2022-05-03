import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Spinner } from '../../img/spinner/spinner.svg';
import { forgotPassword } from '../../firebase';
import './ForgotPassword.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  const isFormValid = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g.test(email);

  const handleReset = async () => {
    setButtonLoading(true);
    const status = await forgotPassword(email);
    if (status === 'Email sent') {
      setEmailSent(true);
    } else {
      setResetPasswordError(status);
      setButtonLoading(false);
    }
  };

  return (
    <div className='forgot-password-container'>
      <div className='forgot-password'>
        <h1 className='ink'>Ink</h1>
        {!emailSent ? (
          <form>
            <input
              className='username'
              type='email'
              aria-label='Email'
              placeholder='Email'
              autoCorrect='off'
              aria-required='true'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className='reset-btn'
              type='submit'
              disabled={!isFormValid}
              onClick={handleReset}
            >
              {!buttonLoading ? 'Reset Password' : ``}
              {buttonLoading && <Spinner className='spinner' />}
            </button>
            <p className='reset-error' role='alert'>
              {resetPasswordError}
            </p>
          </form>
        ) : (
          <div className='email-sent'>
            <h3>Email sent</h3>
            <Link to='/'>Go Back</Link>
          </div>
        )}
      </div>
      <div className='other-action'>
        <Link to='/'>Sign In</Link>
        <Link to='/register'> Sign up</Link>
      </div>
    </div>
  );
};

export default SignIn;
