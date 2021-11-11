import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchIndividualPost } from '../../../firebase';
import { emoji } from '../../../img';
import Loading from '../../Loading/Loading';

import './SolowView.css';

const SoloView = () => {
  const location = useLocation();
  const [postData, setPostData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIndividualPost(location.pathname).then((res) => {
      setPostData(res);
      setLoading(false);
    });
  }, [location.pathname]);

  const renderPost = () => {
    return postData === 'Post not found' || postData === 'User not found' ? (
      <div className='post-error'>
        <h2>{postData}.</h2>
        <p>Please double check the URL to make sure it&#39;s correct.</p>
      </div>
    ) : (
      <div className='solo-view'>
        <figure className='post-image'>
          <img src={postData.post.imageUrl} alt='' />
        </figure>
        <div className='comments'>
          <div className='poster'>
            <Link to={`/${postData.username}`}>
              <img src={postData.photoURL} alt='' />
            </Link>
            <Link to={`/${postData.username}`}>
              <span>{postData.username}</span>
            </Link>
          </div>
          {/* <p>MAP COMMENTS</p> */}
          <section className='add-comment'>
            <button
              type='button'
              className='emoji-btn'
              // onClick={() => displayEmojis(true)}
            >
              <img src={emoji.darkFace} alt='' />
            </button>
            <textarea placeholder='Add a comment...' />
            <button className='post-btn' type='button' disabled>
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
