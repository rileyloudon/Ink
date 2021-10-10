import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { followUser, unfollowUser } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import './Button.css';

const Button = ({ profile, updateProfile }) => {
  const { user } = useContext(UserContext);
  const history = useHistory();

  if (profile.username !== user.displayName) {
    const userFollowsProfile = profile.followers.includes(user.displayName);

    return (
      <button
        onClick={() =>
          !userFollowsProfile
            ? followUser(profile.username).then((res) => updateProfile(res))
            : unfollowUser(profile.username).then((res) => updateProfile(res))
        }
        className={!userFollowsProfile ? 'follow' : 'unfollow'}
        type='button'
      >
        {!userFollowsProfile ? 'Follow' : 'Unfollow'}
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
    username: PropTypes.string.isRequired,
    followers: PropTypes.arrayOf.isRequired,
  }).isRequired,
  updateProfile: PropTypes.func.isRequired,
};

export default Button;
