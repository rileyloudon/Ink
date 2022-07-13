import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchProfilePicture } from '../../firebase';
import Loading from '../Loading/Loading';
import './NewFollowers.css';

const NewFollowers = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [newFollowersWithPictures, setNewFollowersWithPictures] = useState();

  useEffect(() => {
    let isSubscribed = true;

    if (user) {
      (async () => {
        const res = await fetchProfilePicture(user.newFollowers);

        if (isSubscribed) {
          setNewFollowersWithPictures(res);
          setLoading(false);
        }
      })();
    }
    return () => {
      isSubscribed = false;
    };
  }, [user]);

  if (!user) return null;

  return loading ? (
    <Loading />
  ) : (
    <div className='new-followers'>
      <div className='title'>
        <h3>New Followers</h3>
        <p>(since last login)</p>
      </div>
      <div className='followers'>
        {newFollowersWithPictures.map((follower) => (
          <Link key={follower.username} to={`/${follower.username}`}>
            <img src={follower.photoURL} alt='' />
            <span>{follower.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewFollowers;
