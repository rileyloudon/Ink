import { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchProfilePicture } from '../../firebase';
import Loading from '../Loading/Loading';
import './NewFollowers.css';

const NewFollowers = () => {
  const { user } = useContext(UserContext);
  const { username } = useParams();

  const [loading, setLoading] = useState(true);
  const [profilePictures, setProfilePictures] = useState();

  useEffect(() => {
    if (user) {
      const fetchAllProfilePictures = async () => {
        const tempProfilePictures = [];

        // eslint-disable-next-line no-restricted-syntax
        for await (const follower of user.newFollowers) {
          const res = await fetchProfilePicture(follower);
          tempProfilePictures.push(res);
        }

        setProfilePictures(tempProfilePictures);
        setLoading(false);
      };
      fetchAllProfilePictures();
    }
  }, [user]);

  if (!user) return null;

  if (user.username !== username) {
    return (
      <div className='no-new-followers'>
        <h3>You can only view your own new followers</h3>
        <Link
          className='own-new-followers'
          to={`/${user.username}/new-followers`}
        >
          Click here to view them
        </Link>
      </div>
    );
  }

  return loading ? (
    <Loading />
  ) : (
    <div className='new-followers'>
      <div className='title'>
        <h3>New Followers</h3>
        <p>(since last login)</p>
      </div>
      <div className='followers'>
        {user.newFollowers.map((follower, i) => (
          <Link key={follower} to={`/${follower}`}>
            <img src={profilePictures[i]} alt='' />
            <span>{follower}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewFollowers;
