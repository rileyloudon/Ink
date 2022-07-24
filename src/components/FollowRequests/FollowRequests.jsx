import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import {
  fetchFollowRequests,
  acceptFollowRequest,
  denyFollowRequest,
} from '../../firebase';
import Loading from '../Loading/Loading';
import { ReactComponent as Spinner } from '../../img/spinner/spinner.svg';
import './FollowRequests.css';

const FollowRequests = () => {
  const { user, setUser } = useContext(UserContext);
  const [followRequests, setFollowRequests] = useState();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtongLoading] = useState({
    accept: false,
    deny: false,
  });

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

  useEffect(() => {
    let isSubscribed = true;
    if (user)
      (async () => {
        // res returns an object: users & profilePictures
        // thry will be in the same order so users[0] goes with profilePictures[0]
        const res = await fetchFollowRequests();
        if (isSubscribed) {
          setFollowRequests(res);
          setLoading(false);
        }
      })();

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  return loading ? (
    <Loading />
  ) : (
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
            onClick={async () => {
              setButtongLoading({ accept: true, deny: false });
              await acceptFollowRequest(request.username);
              updateRequests(request.username, i);
            }}
          >
            {buttonLoading.accept ? <Spinner className='spinner' /> : 'Accept'}
          </button>
          <button
            className='deny-request'
            type='button'
            onClick={async () => {
              setButtongLoading({ accept: false, deny: true });
              await denyFollowRequest(request.username);
              updateRequests(request.username, i);
            }}
          >
            {buttonLoading.deny ? <Spinner className='spinner' /> : 'Deny'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FollowRequests;
