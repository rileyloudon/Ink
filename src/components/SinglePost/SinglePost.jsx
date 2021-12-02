import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchIndividualPost, toggleLikePost } from '../../firebase';
import Comment from '../Post/Comment/Comment';
import ButtonBar from '../Post/ButtonBar/ButtonBar';
import AddComment from '../Post/AddComment/AddComment';
import Loading from '../Loading/Loading';
import './SinglePost.css';

const SoloView = ({ modal }) => {
  const modalRef = useRef();
  const location = useLocation();
  const history = useHistory();

  const [postData, setPostData] = useState();
  const [loading, setLoading] = useState(true);

  const likePost = () => {
    toggleLikePost(postData.post).then((res) => {
      // res returns if user liked the post
      if (res === true) {
        setPostData((prevState) => ({
          ...prevState,
          likeCount: prevState.likeCount + 1,
          userLikes: true,
        }));
      } else if (res === false) {
        setPostData((prevState) => ({
          ...prevState,
          likeCount: prevState.likeCount - 1,
          userLikes: false,
        }));
      }
    });
  };

  const likeCount = () => {
    if (postData.likeCount >= 1)
      return `${postData.likeCount} like${postData.likeCount === 1 ? '' : 's'}`;
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
      console.log(res);
      setLoading(false);
    });
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        history.goBack();
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
        {modal && <div className='post-backdrop' />}
        <div
          ref={modal ? modalRef : null}
          className={modal ? 'solo-view modal-view' : 'solo-view'}
        >
          <figure className='post-image' onDoubleClick={likePost}>
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
            <section className='comments'>
              <div className='commenter'>
                <Link to={`/${postData.username}`}>
                  <img src={postData.photoURL} alt='' />
                </Link>
                <Link to={`/${postData.username}`}>
                  <span>{postData.username}</span>
                </Link>
                <p className='post-caption'>{postData.post.caption}</p>
              </div>
              {postData.post.comments.map((commentObj) => (
                <Comment key={commentObj.key} commentObj={commentObj} />
              ))}
            </section>
            <section className='interact'>
              <ButtonBar
                likeStatus={postData.userLikes}
                likePost={likePost}
                disableComments={postData.post.disableComments}
                postId={postData.post.id}
              />
              <div className='likes'>
                <p>{likeCount()}</p>
              </div>
              <div className='date'>
                <time dateTime={postData.post.timestamp.toDate()}>
                  {postedDate()}
                </time>
              </div>
            </section>
            {!postData.post.disableComments && (
              <section className='comment-box'>
                <AddComment post={postData.post} />
              </section>
            )}
          </section>
        </div>
      </>
    );
  };

  return loading ? <Loading /> : renderPost();
};

SoloView.defaultProps = {
  modal: false,
};

SoloView.propTypes = {
  modal: PropTypes.bool,
};

export default SoloView;
