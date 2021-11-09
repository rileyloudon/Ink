import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchIndividualPost } from '../../../firebase';
import Loading from '../../Loading/Loading';

import './SolowView.css';

const SoloView = () => {
  const location = useLocation();
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIndividualPost(location.pathname).then((res) => {
      setPost(res);
      setLoading(false);
    });
  }, [location.pathname]);

  const renderPost = () => {
    return post === 'Post not found' || post === 'User not found' ? (
      <div className='error'>
        <h2>{post}.</h2>
        <p>Please double check the URL to make sure it&#39;s correct.</p>
      </div>
    ) : (
      <div className='solo-view'>
        <figure className='post-image'>
          <img src={post.imageUrl} alt='' />
        </figure>
        <div className='comments'>
          {/* <p>MAP COMMENTS</p> */}
          <section className='add-comment'>
            <textarea placeholder='Add a comment...' />
            <button className='post' type='button' disabled>
              Post
            </button>
          </section>
        </div>
      </div>
    );
  };

  return loading ? <Loading /> : renderPost();
};

export default SoloView;
