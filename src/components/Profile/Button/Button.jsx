import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { followUser, unfollowUser } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import './Button.css';

const Button = ({ profile, updateHeader }) => {
  const { user } = useContext(UserContext);
  const history = useHistory();

  const [buttonLoading, setButtonLoading] = useState(false);

  if (user && profile.header.username !== user.displayName) {
    const userFollowsProfile = profile.header.followers.includes(
      user.displayName
    );

    const buttonText = () => {
      if (buttonLoading) return <Spinner className='spinner' />;
      if (!userFollowsProfile) return 'Follow';
      return 'Unfollow';
    };

    const handleClick = async () => {
      setButtonLoading(true);
      if (!userFollowsProfile) {
        const newHeaderData = await followUser(profile.header.username);
        updateHeader(newHeaderData);
      } else {
        const newHeaderData = await unfollowUser(profile.header.username);
        updateHeader(newHeaderData);
      }
      setButtonLoading(false);
    };

    return (
      <button
        onClick={handleClick}
        className={!userFollowsProfile ? 'follow' : 'unfollow'}
        type='button'
      >
        {buttonText()}
      </button>
    );
  }

  return (
    <button
      onClick={() => history.push('/settings')}
      className='edit'
      type='button'
    >
      Edit Profile
    </button>
  );
};

Button.propTypes = {
  profile: PropTypes.shape({
    header: PropTypes.shape({
      username: PropTypes.string.isRequired,
      followers: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  }).isRequired,
  updateHeader: PropTypes.func.isRequired,
};

export default Button;
