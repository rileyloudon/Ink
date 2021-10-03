import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserData } from '../../firebase';
import './Profile.css';

const Profile = () => {
  const location = useLocation();
  const [usersProfile, setUsersProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData(location.pathname.substring(1)).then((res) => {
      setUsersProfile(res);
      setLoading(false);
    });
  }, [location.pathname]);

  const renderProflie = () => {
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
              <li>
                <span>{usersProfile.posts.length}</span> posts
              </li>
              <li>
                <span>{usersProfile.followers.length}</span> followers
              </li>
              <li>
                <span>{usersProfile.following.length}</span> following
              </li>
            </ul>
            <div className='info'>
              <h4>{usersProfile.fullName}</h4>
              {/* <p>{usersProfile.bio}</p> */}
            </div>
          </section>
        </header>
      </div>
    );
  };

  return !loading && renderProflie();
};

export default Profile;
