import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './Posts.css';

const Posts = ({ profile }) => {
  const [displayedPosts, setDisplayedPosts] = useState(
    profile.posts.slice(0, 9)
  );
  const [hiddenPosts, setHiddenPosts] = useState(
    profile.posts.slice(9, profile.posts.length + 1)
  );

  const renderPost = (post) => {
    return (
      <div className='post'>
        <img
          className='post-image'
          key={post.imageUrl}
          src={post.imageUrl}
          alt=''
        />
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
      const addedPosts = hiddenPosts.slice(0, 6);
      setDisplayedPosts((oldArray) => [...oldArray, ...addedPosts]);
      setHiddenPosts((oldArray) => oldArray.slice(6, profile.posts.length + 1));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [profile.posts, hiddenPosts, displayedPosts]);

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
