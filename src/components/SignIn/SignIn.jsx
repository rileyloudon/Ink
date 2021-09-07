import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import astronaut from "../img/user-astronaut-solid.svg";

const SignIn = ({ handleSignIn }) => (
  <div className='home-so'>
    <div className='sign-in'>
      <h1 className='ink'>Ink</h1>
      <form>
        <div className='sign-in-method'>
          <input
            className='username'
            type='text'
            aria-label='Phone number, username, or email'
            placeholder='Phone number, username, or email'
            aria-required='true'
            autoCorrect='off'
          />
          <input
            type='password'
            aria-label='Password'
            placeholder='Password'
            aria-required='true'
          />
          <button className='log-in-btn' type='submit'>
            Log In
          </button>
          <div className='or'>
            <div className='or-line' />
            <p>OR</p>
            <div className='or-line' />
          </div>
          <button
            className='guest-btn'
            type='button'
            onClick={() => handleSignIn("guest")}
          >
            <img src={astronaut} alt='' />
            Log In as Guest
          </button>
        </div>
        <a href='/' className='reset-password'>
          Forgot password?
        </a>
      </form>
    </div>

    <div className='create-account'>
      <p>
        Don&#39;t have an account?
        <Link to='/register'>Sign up</Link>
      </p>
    </div>
  </div>
);

// SignIn.propTypes = {
//   handleSignIn: PropTypes.func.isRequired,
// };

export default SignIn;
