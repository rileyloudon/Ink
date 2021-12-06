import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { registerUser } from '../../firebase';
import UserContext from '../../Context/UserContext';
import astronaut from '../../img/misc/astronaut.svg';
import './Register.css';

const Register = ({ updateLoading, signInGuest }) => {
  const { user, setUser } = useContext(UserContext);

  const history = useHistory();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  const isFormValid =
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g.test(email) &&
    fullName.length >= 1 &&
    /^[\w](?!.*?\.{2})[\w.]{0,14}[\w]$/.test(username) &&
    password.length >= 6;

  const handleRegister = () => {
    updateLoading(true);
    registerUser(email, password, username, fullName).then((res) => {
      if (typeof res === 'string') setRegisterError(res);
      else
        setUser((prevState) => ({
          ...prevState,
          displayName: res.displayName,
          photoURL: res.photoURL,
        }));
      updateLoading(false);
    });
  };

  useEffect(() => {
    if (typeof user === 'object') history.replace('/');
  }, [user, history]);

  return (
    <div className='register-container'>
      <div className='register'>
        <h1 className='ink'>Ink</h1>
        <form className='register-form'>
          <p className='pitch'>
            Sign up to see photos and videos from your friends.
          </p>
          <button
            className='guest-btn'
            type='button'
            onClick={() => {
              signInGuest();
              history.replace('/');
            }}
          >
            <img src={astronaut} alt='' />
            Log In as Guest
          </button>
          <div className='or'>
            <div className='or-line' />
            <p>OR</p>
            <div className='or-line' />
          </div>
          <input
            type='email'
            placeholder='Email'
            aria-label='Email'
            aria-required='true'
            // name='username' is so password managers save and use email
            name='username'
            autoComplete='username email'
            inputMode='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='text'
            spellCheck='off'
            maxLength='16'
            placeholder='Username'
            aria-label='Username'
            aria-required='true'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type='text'
            spellCheck='off'
            placeholder='Full Name'
            aria-label='Full Name'
            aria-required='true'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            autoComplete='new-password'
            type='password'
            placeholder='Password'
            aria-label='Password'
            aria-required='true'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className='register-btn'
            type='button'
            disabled={!isFormValid}
            onClick={() => {
              if (isFormValid) handleRegister();
            }}
          >
            Sign Up
          </button>
          <p className='register-error' role='alert'>
            {registerError}
          </p>
        </form>
      </div>

      <div className='have-account'>
        <p>
          Have an account? <Link to='/'> Log in</Link>
        </p>
      </div>
    </div>
  );
};

Register.propTypes = {
  updateLoading: PropTypes.func.isRequired,
  signInGuest: PropTypes.func.isRequired,
};

export default Register;
