import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchIndividualPost, toggleLikePost } from '../../../firebase';
import { favorite, comment } from '../../../img';
import UserContext from '../../../Context/UserContext';
import AddComment from '../../AddComment/AddComment';
import Loading from '../../Loading/Loading';

import './SolowView.css';

const SoloView = ({ type }) => {
  const { user } = useContext(UserContext);
  const modal = useRef();
  const location = useLocation();
  const history = useHistory();

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modal.current && !modal.current.contains(e.target)) history.goBack();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [history]);

  const renderPost = () => {
    return postData === 'Post not found' || postData === 'User not found' ? (
      <div className='post-error'>
        <h2>{postData}.</h2>
        <p>Please double check the URL to make sure it&#39;s correct.</p>
      </div>
    ) : (
      <>
        {type === 'modal' && <div className='post-backdrop' />}
        <div
          ref={type === 'modal' ? modal : null}
          className={type === 'modal' ? 'solo-view modal-view' : 'solo-view'}
        >
          <figure
            className='post-image'
            onDoubleClick={() =>
              toggleLikePost(postData.username, location.pathname)
            }
          >
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
                  onClick={() =>
                    toggleLikePost(postData.username, location.pathname)
                  }
                >
                  <img
                    src={
                      postData.post.likes.includes(user.displayName)
                        ? favorite.darkLikedFavorite
                        : favorite.favoriteNotActive
                    }
                    alt=''
                  />
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
      </>
    );
  };

  return loading ? <Loading /> : renderPost();
};

SoloView.propTypes = {
  type: PropTypes.string.isRequired,
};

export default SoloView;
