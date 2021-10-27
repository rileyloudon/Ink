import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserData } from '../../firebase';
import Loading from '../Loading/Loading';
import Bar from './Bar/Bar';
import Header from './Header/Header';
import Posts from './Posts/Posts';
import './Profile.css';

const Profile = () => {
  const location = useLocation();

  const [profile, setProfile] = useState();
  const [userExists, setUserExists] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData(location.pathname.substring(1)).then((res) => {
      if (res === 'User not found') setUserExists(false);
      else {
        setProfile(res);
        setUserExists(true);
      }
      setLoading(false);
    });
  }, [location.pathname]);

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const renderProflie = () => {
    return userExists ? (
      <div className='profile'>
        <Header profile={profile} updateProfile={updateProfile} />
        <Bar />
        <Posts profile={profile} />
      </div>
    ) : (
      <div className='no-user'>
        <h2>User Not Found.</h2>
        <p>Please double check the URL to make sure it&#39;s correct.</p>
      </div>
    );
  };

  return loading ? <Loading /> : renderProflie();
};

export default Profile;
