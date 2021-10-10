import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserData } from '../../firebase';
import Loading from '../Loading/Loading';
import Bar from './Bar/Bar';
import Header from './Header/Header';
import './Profile.css';

const Profile = () => {
  const location = useLocation();

  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData(location.pathname.substring(1)).then((res) => {
      setProfile(res);
      setLoading(false);
    });
  }, [location.pathname]);

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const renderProflie = () => {
    return (
      <div className='profile'>
        <Header profile={profile} updateProfile={updateProfile} />
        <Bar />
      </div>
    );
  };

  return loading ? <Loading /> : renderProflie();
};

export default Profile;
