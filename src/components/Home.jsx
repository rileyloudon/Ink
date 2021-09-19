import PropTypes from 'prop-types';
import Feed from './Feed/Feed';
import SignIn from './SignIn/SignIn';
import Loading from './Loading/Loading';

const Home = ({ user, handleSignIn, loading }) => {
  return (
    <>
      {loading && <Loading />}
      {!user ? <SignIn handleSignIn={handleSignIn} /> : <Feed user={user} />}
    </>
  );
};

Home.defaultProps = {
  user: undefined,
};

Home.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
  handleSignIn: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Home;
