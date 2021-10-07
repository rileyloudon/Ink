import { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchUserData, followUser, unfollowUser } from '../../firebase';
import './Profile.css';

const Profile = () => {
  const history = useHistory();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [isUsersProfile, setIsUsersProfile] = useState();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData(location.pathname.substring(1)).then((res) => {
      setProfile(res);
      if (user.displayName === res.username) setIsUsersProfile(true);
      else setIsUsersProfile(false);
      setLoading(false);
    });
  }, [location.pathname, user.displayName]);

  const InteractiveButton = () => {
    if (!isUsersProfile && !profile.followers.includes(user.displayName)) {
      return (
        <button
          onClick={() =>
            followUser(profile.username).then((res) => setProfile(res))
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
            unfollowUser(profile.username).then((res) => setProfile(res))
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

  const renderProflie = () => {
    return (
      <div className='profile'>
        <header className='profile-header'>
          <div className='left'>
            <img className='picture' src={profile.photoURL} alt='' />
          </div>
          <section className='right'>
            <div className='top'>
              <h3 className='username'>{profile.username}</h3>
              <InteractiveButton />
            </div>
            <ul className='stats'>
              <li>
                <span>{profile.posts.length}</span> posts
              </li>
              <li>
                <span>{profile.followers.length}</span> followers
              </li>
              <li>
                <span>{profile.following.length}</span> following
              </li>
            </ul>
            <div className='info'>
              <h4>{profile.fullName}</h4>
              <p>{profile.bio}</p>
            </div>
          </section>
        </header>
      </div>
    );
  };

  return !loading && renderProflie();
};

export default Profile;
