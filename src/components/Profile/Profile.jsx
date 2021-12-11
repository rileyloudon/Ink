import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserData } from '../../firebase';
import Loading from '../Loading/Loading';
import Bar from './Bar/Bar';
import Header from './Header/Header';
import Posts from './Posts/Posts';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();

  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  const updateHeader = (newHeader) => {
    setProfile((oldProfile) => ({
      ...oldProfile,
      header: newHeader,
    }));
  };

  useEffect(() => {
    fetchUserData(username).then((res) => {
      // res returns an object:
      // header: all data for the header
      // initialPosts: first 12 posts, fetch more on scroll
      setProfile(res);
      setLoading(false);
    });
  }, [username]);

  const renderProflie = () => {
    return profile === 'User not found' ? (
      <div className='no-user'>
        <h2>User Not Found.</h2>
        <p>Please double check the URL to make sure it&#39;s correct.</p>
      </div>
    ) : (
      <div className='profile'>
        <Header profile={profile} updateHeader={updateHeader} />
        <Bar />
        <Posts
          username={profile.header.username}
          initialPosts={profile.initialPosts}
        />
      </div>
    );
  };

  return loading ? <Loading /> : renderProflie();
};

export default Profile;
