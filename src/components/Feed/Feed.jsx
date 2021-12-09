import { useContext, useEffect, useState } from 'react';
import UserContext from '../../Context/UserContext';
import { fetchFeed } from '../../firebase';
import Loading from '../Loading/Loading';
import VerticalPost from '../Post/VerticalPost/VerticalPost';
import './Feed.css';

const Feed = () => {
  const { user } = useContext(UserContext);
  const [feedPosts, setFeedPosts] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.displayName !== null)
      fetchFeed().then((res) => {
        setFeedPosts(res);
        setLoading(false);
      });
  }, [user]);

  const allPosts = () => {
    return (
      <>
        {feedPosts.length === 0 ? (
          <div className='no-feed-posts'>
            <h3>No posts to show</h3>
            <p>Try following someone to see their posts here</p>
          </div>
        ) : (
          feedPosts.map((post) => <VerticalPost key={post.id} post={post} />)
        )}
      </>
    );
  };

  return loading ? <Loading /> : allPosts();
};

export default Feed;
