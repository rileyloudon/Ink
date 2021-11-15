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

  const likeCount = () => {
    if (postData.post.likes.length >= 1)
      return `${postData.post.likes.length} like${postData.post.likes.length}` ===
        1
        ? null
        : 's';
    return 'Be the first to like this';
  };

  const postedDate = () => {
    const postDate = postData.post.timestamp.toDate();
    const todaysDate = new Date();
    const difference = Math.round(
      Math.abs(todaysDate - postDate) / (1000 * 60 * 60 * 24)
    );

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    if (difference > 7)
      return `${
        monthNames[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}`;
    if (difference > 1 && difference <= 7) return `${difference} days ago`;
    if (difference === 1) return 'Yesterday';
    return 'Today';
  };

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
        <figure className='post-image' onDoubleClick={() => console.log('hi')}>
          <img src={postData.post.imageUrl} alt='' />
        </figure>
        <section className='side-bar'>
          <section className='poster'>
            <Link to={`/${postData.username}`}>
              <img src={postData.photoURL} alt='' />
            </Link>
            <Link to={`/${postData.username}`}>
              <span>{postData.username}</span>
            </Link>
          </section>
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
              <p>{likeCount()}</p>
            </div>
            <div className='date'>
              <time dateTime={postData.post.timestamp.toDate()}>
                {postedDate()}
              </time>
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
