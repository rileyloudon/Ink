import { useContext, useEffect, useState } from 'react';
import UserContext from '../../Context/UserContext';
import { fetchFeed, fetchNextFeedPosts } from '../../firebase';
import Loading from '../Loading/Loading';
import VerticalPost from '../Post/VerticalPost/VerticalPost';
import './Feed.css';

const Feed = () => {
  const { user } = useContext(UserContext);
  const [displayedPosts, setDisplayedPosts] = useState();
  const [nextPosts, setNextPosts] = useState();
  const [fetchInProgress, setFetchInProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    if (user.displayName !== null)
      // fetchFeed returns the first 20 posts, fetch more on scroll
      fetchFeed().then((res) => {
        if (isSubscribed) {
          setDisplayedPosts(res.slice(0, 10));
          setNextPosts(res.slice(10));
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [user]);

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
          'main',
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

  const allPosts = () => {
    return (
      <>
        {displayedPosts.length === 0 ? (
          <div className='no-feed-posts'>
            <h3>No posts to show</h3>
            <p>Try following someone to see their posts here</p>
          </div>
        ) : (
          displayedPosts.map((post) => (
            <VerticalPost key={post.id} post={post} />
          ))
        )}
      </>
    );
  };

  return loading ? <Loading /> : allPosts();
};

export default Feed;
