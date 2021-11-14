import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchIndividualPost } from '../../../firebase';
import { favorite, comment } from '../../../img';
import AddComment from '../../AddComment/AddComment';
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
        <section className='side-bar'>
          <setion className='poster'>
            <Link to={`/${postData.username}`}>
              <img src={postData.photoURL} alt='' />
            </Link>
            <Link to={`/${postData.username}`}>
              <span>{postData.username}</span>
            </Link>
          </setion>
          <section className='comments' />
          <section className='interact'>
            <div className='icons'>
              <button
                type='button'
                // onClick={LIKE POST}
              >
                <img src={favorite.favoriteNotActive} alt='' />
              </button>
              <button
                type='button'
                onClick={() => document.getElementById('textarea').focus()}
              >
                <img src={comment.darkTextOutline} alt='' />
              </button>
            </div>
            <div className='likes'>
              <p>
                {postData.post.likes.length === 0
                  ? 'Be the first to like this'
                  : `${postData.post.likes.length} likes`}
              </p>
            </div>
          </section>
          <section className='comment-box'>
            <AddComment />
          </section>
        </section>
      </div>
    );
  };

  return loading ? <Loading /> : renderPost();
};

export default SoloView;
