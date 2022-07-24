import { useContext, useEffect, useState } from 'react';
import UserContext from '../../Context/UserContext';
import { fetchLikedPosts, fetchNextLikedPosts } from '../../firebase';
import Loading from '../Loading/Loading';
import VerticalPost from '../Post/VerticalPost/VerticalPost';
import './LikedFeed.css';

const LikedFeed = () => {
  const { user } = useContext(UserContext);

  const [displayedPosts, setDisplayedPosts] = useState();
  const [nextPosts, setNextPosts] = useState();
  const [fetchInProgress, setFetchInProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    if (user)
      (async () => {
        const res = await fetchLikedPosts();
        if (isSubscribed) {
          setDisplayedPosts(res.slice(0, 10));
          setNextPosts(res.slice(10));
          setLoading(false);
        }
      })();

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
        const posts = await fetchNextLikedPosts(
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

  return loading ? (
    <Loading />
  ) : (
    <>
      {displayedPosts.length === 0 ? (
        <div className='no-liked-posts'>
          <h3>No posts to show</h3>
          <p>Try liking a post to see it here</p>
        </div>
      ) : (
        displayedPosts.map((post) => <VerticalPost key={post.id} post={post} />)
      )}
    </>
  );
};

export default LikedFeed;
