import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchUserProfileData } from '../../firebase';
import Loading from '../Loading/Loading';
import Bar from './Bar/Bar';
import Header from './Header/Header';
import Posts from './Posts/Posts';
import './Profile.css';

const Profile = ({ scrollPosition, updateScrollPosition }) => {
  const { user } = useContext(UserContext);
  const { username } = useParams();

  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  const updateHeader = (newData, updateFollowRequest) => {
    if (updateFollowRequest)
      setProfile((oldProfile) => ({
        ...oldProfile,
        followRequest: newData,
      }));
    else
      setProfile((oldProfile) => ({
        ...oldProfile,
        header: newData,
      }));
  };

  // scrollPosition restores scroll when opening or closing a post modal.
  // Initial load always loads at the top
  window.scrollTo(0, scrollPosition);

  useEffect(() => {
    document.title = `${username} - Ink`;
  }, [username]);

  useEffect(() => {
    let isSubscribed = true;
    if (user)
      fetchUserProfileData(username).then((res) => {
        // res returns an object OR 'User not found'
        // header: all data for the header
        // initialPosts: first 12 posts, fetch more on scroll OR 'private' if profile is private
        // if above is 'private', also includes followRequest true/false
        if (isSubscribed) {
          setProfile(res);
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [username, user]);

  const renderProflie = () => {
    return profile === 'User not found' ? (
      <div className='no-user'>
        <h2>User Not Found</h2>
        <p>Please double check the URL to make sure it&#39;s correct</p>
      </div>
    ) : (
      <div className='profile'>
        <Header profile={profile} updateHeader={updateHeader} />
        {profile.initialPosts === 'private' ? (
          <div className='private'>
            <h3>This Account is Private</h3>
            <p>Follow to see their posts</p>
          </div>
        ) : (
          <>
            <Bar />
            <Posts
              username={profile.header.username}
              initialPosts={profile.initialPosts}
              updateScrollPosition={updateScrollPosition}
            />
          </>
        )}
      </div>
    );
  };

  return loading ? <Loading /> : renderProflie();
};

Profile.propTypes = {
  scrollPosition: PropTypes.number.isRequired,
  updateScrollPosition: PropTypes.func.isRequired,
};

export default Profile;
