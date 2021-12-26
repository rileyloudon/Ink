import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { followUser, unfollowUser } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import './Button.css';

const Button = ({ profile, updateHeader }) => {
  const { user } = useContext(UserContext);
  const history = useHistory();

  // const [working, setWorking] = useState(false);

  if (user && profile.header.username !== user.displayName) {
    const userFollowsProfile = profile.header.followers.includes(
      user.displayName
    );

    return (
      <button
        onClick={() =>
          !userFollowsProfile
            ? followUser(profile.header.username).then((res) =>
                updateHeader(res)
              )
            : unfollowUser(profile.header.username).then((res) =>
                updateHeader(res)
              )
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
    header: PropTypes.shape({
      username: PropTypes.string.isRequired,
      followers: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  }).isRequired,
  updateHeader: PropTypes.func.isRequired,
};

export default Button;
