import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchLikedPosts, fetchNextFeedPosts } from '../../firebase';
import Loading from '../Loading/Loading';
import VerticalPost from '../Post/VerticalPost/VerticalPost';
import './LikedFeed.css';

const LikedFeed = () => {
  const { user } = useContext(UserContext);

  const { username } = useParams();

  const [displayedPosts, setDisplayedPosts] = useState();
  const [nextPosts, setNextPosts] = useState();
  const [fetchInProgress, setFetchInProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    // prevents seeing no posts message if you click the link when viewing another persons liked posts.
    if (!setLoading) setLoading(true);

    fetchLikedPosts().then((res) => {
      if (isSubscribed) {
        setDisplayedPosts(res.slice(0, 10));
        setNextPosts(res.slice(10));
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const loadMorePosts = async () => {
      if (
        Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight - 250 &&
        nextPosts &&
        nextPosts[nextPosts.length - 1] &&
        !fetchInProgress &&
        isSubscribed
      ) {
        const posts = await fetchNextFeedPosts(
          'liked',
          nextPosts[nextPosts.length - 1].timestamp
        );
        if (isSubscribed) {
          setFetchInProgress(true);
          setDisplayedPosts((oldArray) => [...oldArray, ...nextPosts]);
          setNextPosts(posts);
          setFetchInProgress(false);
        }
      }
    };
    window.addEventListener('scroll', loadMorePosts);
    return () => {
      isSubscribed = false;
      window.removeEventListener('scroll', loadMorePosts);
    };
  }, [nextPosts, displayedPosts, fetchInProgress]);

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
        {displayedPosts.length === 0 ? (
          <div className='no-liked-posts'>
            <h3>No posts to show</h3>
            <p>Try liking a post to see it here</p>
          </div>
        ) : (
          displayedPosts.map((post) => (
            <VerticalPost key={post.id} post={post} />
          ))
        )}
      </>
    );
  };

  return loading ? <Loading /> : posts();
};

export default LikedFeed;
