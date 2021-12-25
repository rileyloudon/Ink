import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchNextProfilePosts } from '../../../firebase';
import { ReactComponent as FavoriteFilled } from '../../../img/favorite/favorite-filled.svg';
import { ReactComponent as CommentFilled } from '../../../img/comment/comment-filled.svg';
import './Posts.css';

const Posts = ({ username, initialPosts }) => {
  const location = useLocation();

  const [displayedPosts, setDisplayedPosts] = useState();
  const [nextPosts, setNextPosts] = useState();
  const [fetchInProgress, setFetchInProgress] = useState(false);

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
              <FavoriteFilled />
              {post.likes.length}
            </span>
            <span>
              {post.disableComments ? null : (
                <span>
                  <CommentFilled />
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
    let isSubscribed = true;

    const loadMorePosts = async () => {
      if (
        Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight - 100 &&
        nextPosts &&
        nextPosts[nextPosts.length - 1] &&
        !fetchInProgress &&
        isSubscribed
      ) {
        const posts = await fetchNextProfilePosts(
          username,
          nextPosts[nextPosts.length - 1].timestamp
        );
        if (isSubscribed) {
          setFetchInProgress(true);
          setDisplayedPosts([...displayedPosts, ...nextPosts]);
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
  }, [nextPosts, username, fetchInProgress, displayedPosts]);

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
