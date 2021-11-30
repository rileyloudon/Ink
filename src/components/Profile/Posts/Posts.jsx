import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { comment, favorite } from '../../../img/index';
import './Posts.css';

const Posts = ({ profile }) => {
  const location = useLocation();

  const [displayedPosts, setDisplayedPosts] = useState();
  const [hiddenPosts, setHiddenPosts] = useState();

  const renderPost = (post) => {
    return (
      <Link
        className='post'
        key={post.imageUrl}
        to={{
          pathname: `/${profile.header.username}/${post.id}`,
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
    setDisplayedPosts([...profile.posts].reverse().slice(0, 9));
    setHiddenPosts(
      [...profile.posts].reverse().slice(9, [...profile.posts].length + 1)
    );
  }, [profile]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      const addPosts = hiddenPosts.slice(0, 6);
      setDisplayedPosts((oldArray) => [...oldArray, ...addPosts]);
      setHiddenPosts((oldArray) =>
        oldArray.slice(6, [...profile.posts].length + 1)
      );
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hiddenPosts, displayedPosts, profile]);

  return (
    <div className='posts'>
      {displayedPosts ? displayedPosts.map((post) => renderPost(post)) : null}
    </div>
  );
};

Posts.propTypes = {
  profile: PropTypes.shape({
    header: PropTypes.shape({
      username: PropTypes.string,
    }),
    posts: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default Posts;
