import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import astronaut from '../../img/misc/astronaut.svg';
import './Register.css';

// if user redirect to different page -> prevent registering then back button

const Register = ({ handleSignIn }) => {
  const history = useHistory();
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
              history.replace('/');
              handleSignIn('Guest');
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
            required
          />
          <input
            type='text'
            placeholder='Full Name'
            aria-label='Full Name'
            aria-required='true'
            required
          />
          <input
            type='text'
            placeholder='Username'
            aria-label='Username'
            aria-required='true'
            required
          />
          <input
            type='password'
            placeholder='Password'
            aria-label='Password'
            aria-required='true'
            required
          />
          <button className='register-btn' type='button'>
            Sign Up
          </button>
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
  handleSignIn: PropTypes.func.isRequired,
};

export default Register;
