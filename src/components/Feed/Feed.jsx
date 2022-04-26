import { useContext, useEffect, useState } from 'react';
import UserContext from '../../Context/UserContext';
import { fetchFeed } from '../../firebase';
import Loading from '../Loading/Loading';
import VerticalPost from '../Post/VerticalPost/VerticalPost';
import './Feed.css';

const Feed = () => {
  const { user } = useContext(UserContext);
  const [displayedPosts, setDisplayedPosts] = useState();
  const [nextPosts, setNextPosts] = useState();
  const [loading, setLoading] = useState(true);

  const postsPerRender = 10;

  useEffect(() => {
    let isSubscribed = true;

    if (user)
      (async () => {
        const res = await fetchFeed();
        if (isSubscribed) {
          setDisplayedPosts(res.slice(0, postsPerRender));
          setNextPosts(res.slice(postsPerRender));
          setLoading(false);
        }
      })();

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  useEffect(() => {
    const loadMorePosts = async () => {
      if (
        Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight - 250 &&
        nextPosts &&
        nextPosts[nextPosts.length - 1]
      ) {
        setDisplayedPosts((oldArray) => [
          ...oldArray,
          ...nextPosts.slice(0, postsPerRender),
        ]);
        setNextPosts(nextPosts.slice(postsPerRender));
      }
    };
    window.addEventListener('scroll', loadMorePosts);
    return () => window.removeEventListener('scroll', loadMorePosts);
  }, [nextPosts, displayedPosts]);

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
