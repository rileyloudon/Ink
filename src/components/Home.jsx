import PropTypes from 'prop-types';
import { useContext } from 'react';
import Feed from './Feed/Feed';
import SignIn from './SignIn/SignIn';
import Loading from './Loading/Loading';
import UserContext from '../Context/UserContext';

const Home = ({ loading, updateLoading, signInGuest }) => {
  const { user } = useContext(UserContext);

  const homeContent = () =>
    user ? (
      <Feed />
    ) : (
      <SignIn updateLoading={updateLoading} signInGuest={signInGuest} />
    );

  return loading ? <Loading /> : homeContent();
};

Home.propTypes = {
  loading: PropTypes.bool.isRequired,
  updateLoading: PropTypes.func.isRequired,
  signInGuest: PropTypes.func.isRequired,
};

export default Home;
