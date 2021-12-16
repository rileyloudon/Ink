import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchLikedPosts } from '../../firebase';
import Loading from '../Loading/Loading';
import VerticalPost from '../Post/VerticalPost/VerticalPost';
import './LikedFeed.css';

const LikedFeed = () => {
  const { user } = useContext(UserContext);

  const { username } = useParams();

  const [likedPosts, setLikedPosts] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    // prevents seeing no posts message if you click the link when viewing another persons liked posts.
    if (!setLoading) setLoading(true);

    fetchLikedPosts().then((res) => {
      if (isSubscribed) {
        setLikedPosts(res);
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const posts = () => {
    if (user.displayName !== username) {
      return (
        <div className='no-liked-posts'>
          <h3>You can only view your own liked posts</h3>
          <Link className='own-liked-posts' to={`/${user.displayName}/liked`}>
            Click here to view them
          </Link>
        </div>
      );
    }

    return (
      <>
        {likedPosts.length === 0 ? (
          <div className='no-liked-posts'>
            <h3>No posts to show 🙁</h3>
            <p>Try liking a post to see it here</p>
          </div>
        ) : (
          likedPosts.map((post) => <VerticalPost key={post.id} post={post} />)
        )}
      </>
    );
  };

  return loading ? <Loading /> : posts();
};

export default LikedFeed;
