import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { followUser, unfollowUser } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import './Button.css';

const Button = ({ profile, isUsersProfile, updateProfile }) => {
  const { user } = useContext(UserContext);
  const history = useHistory();

  if (!isUsersProfile && !profile.followers.includes(user.displayName)) {
    return (
      <button
        onClick={() =>
          followUser(profile.username).then((res) => updateProfile(res))
        }
        className='follow'
        type='button'
      >
        Follow
      </button>
    );
  }

  if (!isUsersProfile && profile.followers.includes(user.displayName)) {
    return (
      <button
        onClick={() =>
          unfollowUser(profile.username).then((res) => updateProfile(res))
        }
        className='unfollow'
        type='button'
      >
        Unfollow
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
  isUsersProfile: PropTypes.bool.isRequired,
  updateProfile: PropTypes.func.isRequired,
};

export default Button;
