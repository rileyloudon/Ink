import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './Posts.css';

const Posts = ({ profile }) => {
  const [first9Posts, setFirst9Posts] = useState([]);
  // const [hiddenPosts, setHiddenPosts] = useState([]);

  const initialPosts = first9Posts.map((post) => {
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
  });

  useEffect(() => {
    setFirst9Posts(profile.posts.slice(0, 9).reverse());
    // setHiddenPosts(profile.posts.slice(9, profile.posts.length + 1));
  }, [profile.posts]);

  return <div className='posts'>{initialPosts}</div>;
};

Posts.propTypes = {
  profile: PropTypes.shape({
    posts: PropTypes.arrayOf.isRequired,
  }).isRequired,
};

export default Posts;
