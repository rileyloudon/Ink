import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import {
  fetchFollowRequests,
  acceptFollowRequest,
  denyFollowRequest,
} from '../../firebase';
import Loading from '../Loading/Loading';
import './FollowRequests.css';

const FollowRequests = () => {
  const { user, setUser } = useContext(UserContext);
  const [followRequests, setFollowRequests] = useState();
  const [loading, setLoading] = useState(true);

  const updateRequests = (userToRemove, i) => {
    const filteredUsers = followRequests.users.filter(
      (currentUser) => currentUser.username !== userToRemove
    );
    const filteredPictures = followRequests.profilePictures.filter(
      (picture) => picture !== followRequests.profilePictures[i]
    );

    setFollowRequests({
      users: filteredUsers,
      profilePictures: filteredPictures,
    });

    setUser((prevState) => ({
      ...prevState,
      followRequests: prevState.followRequests - 1,
    }));
  };

  const requests = () => {
    if (followRequests.users && followRequests.users.length === 0) {
      return <h3 className='no-requests'>No follow requests to show</h3>;
    }

    return (
      <div className='follow-requests'>
        <h3>Follow Requests</h3>
        {followRequests.users.map((request, i) => (
          <div className='request' key={request.username}>
            <Link to={`/${request.username}`}>
              <img src={followRequests.profilePictures[i]} alt='' />
              <span>{request.username}</span>
            </Link>
            <button
              className='accept-request'
              type='button'
              onClick={() => {
                acceptFollowRequest(request.username).then(() => {
                  updateRequests(request.username, i);
                });
              }}
            >
              Accept
            </button>
            <button
              className='deny-request'
              type='button'
              onClick={() => {
                denyFollowRequest(request.username).then(() => {
                  updateRequests(request.username, i);
                });
              }}
            >
              Deny
            </button>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    let isSubscribed = true;
    if (user)
      fetchFollowRequests().then((res) => {
        if (isSubscribed) {
          setFollowRequests(res);
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  return loading ? <Loading /> : requests();
};

export default FollowRequests;
