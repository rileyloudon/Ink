import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { comment, favorite } from '../../../img/index';
import './Posts.css';

const Posts = ({ profile }) => {
  // Default order renders oldest first, this way we render newest first.
  const reversePosts = [...profile.posts].reverse();

  const [displayedPosts, setDisplayedPosts] = useState(
    reversePosts.slice(0, 9)
  );
  const [hiddenPosts, setHiddenPosts] = useState(
    reversePosts.slice(9, reversePosts.length + 1)
  );

  const viewPost = () => {
    console.log('hi');
  };

  const renderPost = (post) => {
    return (
      <div key={post.imageUrl} className='post'>
        <img className='post-image' src={post.imageUrl} alt='' />
        <div
          className='view-post'
          onClick={viewPost}
          onKeyPress={viewPost}
          aria-label='View Post'
          role='button'
          tabIndex={-1}
        >
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
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      const addPosts = hiddenPosts.slice(0, 6);
      setDisplayedPosts((oldArray) => [...oldArray, ...addPosts]);
      setHiddenPosts((oldArray) => oldArray.slice(6, reversePosts.length + 1));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reversePosts, hiddenPosts, displayedPosts]);

  return (
    <div className='posts'>
      {displayedPosts.map((post) => renderPost(post))}
    </div>
  );
};

Posts.propTypes = {
  profile: PropTypes.shape({
    posts: PropTypes.arrayOf.isRequired,
  }).isRequired,
};

export default Posts;
