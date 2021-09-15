import PropTypes from 'prop-types';
import Feed from './Feed/Feed';
import SignIn from './SignIn/SignIn';

const Home = ({ user, handleSignIn }) => {
  return (
    <>{!user ? <SignIn handleSignIn={handleSignIn} /> : <Feed user={user} />}</>
  );
};

Home.defaultProps = {
  user: undefined,
};

Home.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  handleSignIn: PropTypes.func.isRequired,
};

export default Home;
