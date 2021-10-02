import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserData } from '../../firebase';

const Profile = () => {
  const location = useLocation();
  const [usersProfile, setUsersProfile] = useState();

  useEffect(() => {
    fetchUserData(location.pathname.substring(1)).then((res) =>
      setUsersProfile(res)
    );
  }, [location.pathname]);

  return (
    <div className='profile'>
      <header className='profile-header'>
        <div className='left'>
          <img className='picture' src={usersProfile.photoURL} alt='' />
        </div>
        <section className='right'>
          <div className='top'>
            <h3 className='username'>{usersProfile.username}</h3>
            <button className='follow' type='button'>
              Follow
            </button>
          </div>
          <ul className='stats'>
            <li>{usersProfile.posts.length} posts</li>
            <li>{usersProfile.followers.length} followers</li>
            <li>{usersProfile.following.length} following</li>
          </ul>
        </section>
        <div className='info'>
          <h4>{usersProfile.fullName}</h4>
          <p>{usersProfile.bio}</p>
        </div>
      </header>
    </div>
  );
};

export default Profile;
