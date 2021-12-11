import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchNextProfilePosts } from '../../../firebase';
import { comment, favorite } from '../../../img/index';
import './Posts.css';

const Posts = ({ username, initialPosts }) => {
  const location = useLocation();

  const [displayedPosts, setDisplayedPosts] = useState();
  const [nextPosts, setNextPosts] = useState();

  const renderPost = (post) => {
    return (
      <Link
        className='post'
        key={post.imageUrl}
        to={{
          pathname: `/${username}/${post.id}`,
          state: { background: location },
        }}
      >
        <img className='post-image' src={post.imageUrl} alt='' />
        <div className='view-post'>
          <div className='post-stats'>
            <span>
              <img src={favorite.lightFavoriteActive} alt='' />
              {post.likes.length}
            </span>
            <span>
              {post.disableComments ? null : (
                <span>
                  <img src={comment.lightTextBubble} alt='' />{' '}
                  {post.comments.length}
                </span>
              )}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  useEffect(() => {
    setDisplayedPosts(initialPosts.slice(0, 6));
    setNextPosts(initialPosts.slice(6));
  }, [initialPosts]);

  useEffect(() => {
    const loadMorePosts = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setDisplayedPosts((oldArray) => [...oldArray, ...nextPosts]);
        fetchNextProfilePosts(
          username,
          nextPosts[nextPosts.length - 1].timestamp
        ).then((res) => setNextPosts(res));
      }
    };
    if (nextPosts && nextPosts[nextPosts.length - 1])
      window.addEventListener('scroll', loadMorePosts);
    return () => window.removeEventListener('scroll', loadMorePosts);
  }, [nextPosts, username, displayedPosts]);

  return (
    <div className='posts'>
      {displayedPosts ? displayedPosts.map((post) => renderPost(post)) : null}
    </div>
  );
};

Posts.defaultProps = {
  initialPosts: [],
};

Posts.propTypes = {
  username: PropTypes.string.isRequired,
  initialPosts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Posts;
