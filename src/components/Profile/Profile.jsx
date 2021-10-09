import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchUserData } from '../../firebase';
import Bar from './Bar/Bar';
import Header from './Header/Header';
import './Profile.css';

const Profile = () => {
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

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const renderProflie = () => {
    return (
      <div className='profile'>
        <Header
          profile={profile}
          updateProfile={updateProfile}
          isUsersProfile={isUsersProfile}
        />
        <Bar />
      </div>
    );
  };

  return !loading && renderProflie();
};

export default Profile;
