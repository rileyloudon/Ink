import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchFollowRequests, acceptFollowRequest } from '../../firebase';
import Loading from '../Loading/Loading';
import './FollowRequests.css';

const FollowRequests = () => {
  const { user, setUser } = useContext(UserContext);
  const [followRequests, setFollowRequests] = useState();
  const [loading, setLoading] = useState(true);

  const requests = () => {
    if (followRequests.users && followRequests.users.length === 0) {
      return <h2 className='no-requests'>No follow requests to show</h2>;
    }
    return followRequests.users.map((request, i) => {
      return (
        <div className='request' key={request.username}>
          <Link to={`/${request.username}`}>
            <img src={followRequests.profilePictures[i]} alt='' />
            <p>{request.username}</p>
          </Link>
          <button
            className='accept-request'
            type='button'
            onClick={() => {
              acceptFollowRequest(request.username).then((res) => {
                setUser(res);

                const filteredUsers = followRequests.users.filter(
                  (currentUser) => currentUser.username !== request.username
                );
                const filteredPictures = followRequests.profilePictures.filter(
                  (picture) => picture !== followRequests.profilePictures[i]
                );

                setFollowRequests({
                  users: filteredUsers,
                  profilePictures: filteredPictures,
                });
              });
            }}
          >
            Accept
          </button>
          <button className='deny-request' type='button'>
            Deny
          </button>
        </div>
      );
    });
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
