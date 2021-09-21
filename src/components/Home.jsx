import PropTypes from 'prop-types';
import { useContext } from 'react';
import Feed from './Feed/Feed';
import SignIn from './SignIn/SignIn';
import Loading from './Loading/Loading';
import UserContext from '../Context/UserContext';

const Home = ({ handleSignIn, loading, signInError }) => {
  const { user } = useContext(UserContext);

  return (
    <>
      {loading && <Loading />}
      {!user ? (
        <SignIn handleSignIn={handleSignIn} signInError={signInError} />
      ) : (
        <Feed />
      )}
    </>
  );
};

Home.defaultProps = {
  signInError: '',
};

Home.propTypes = {
  handleSignIn: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  signInError: PropTypes.string,
};

export default Home;
