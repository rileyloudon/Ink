import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import Feed from './Feed/Feed';
import SignIn from './SignIn/SignIn';
import Loading from './Loading/Loading';
import UserContext from '../Context/UserContext';

const Home = ({ loading, updateLoading, signInGuest }) => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    document.title = 'Ink';
  }, []);

  return (
    <>
      {loading && <Loading />}
      {!user ? (
        <SignIn updateLoading={updateLoading} signInGuest={signInGuest} />
      ) : (
        <Feed />
      )}
    </>
  );
};

Home.propTypes = {
  loading: PropTypes.bool.isRequired,
  updateLoading: PropTypes.func.isRequired,
  signInGuest: PropTypes.func.isRequired,
};

export default Home;
