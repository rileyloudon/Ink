import React, { useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchIndividualPost, toggleLikePost } from '../../../firebase';
import Comment from '../Comment/Comment';
import ButtonBar from '../ButtonBar/ButtonBar';
import AddComment from '../AddComment/AddComment';
import Loading from '../../Loading/Loading';
import Likes from '../Likes/Likes';
import DatePosted from '../DatePosted/DatePosted';
import Caption from '../Caption/Caption';
import Owner from '../Owner/Owner';
import './HorizontalPost.css';

const HorizontalPost = ({ modal }) => {
  const modalRef = useRef();

  const { username, postId } = useParams();
  const history = useHistory();

  const [postData, setPostData] = useState();
  const [loading, setLoading] = useState(true);

  const updateCommentsArray = (comments) => {
    setPostData((prevState) => ({
      ...prevState,
      post: {
        ...prevState.post,
        comments,
      },
    }));
  };

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

  useEffect(() => {
    fetchIndividualPost(username, postId).then((res) => {
      setPostData(res);
      setLoading(false);
    });
  }, [username, postId]);

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
          className={modal ? 'horizontal-view modal-view' : 'horizontal-view'}
        >
          <figure className='post-image' onDoubleClick={likePost}>
            <img src={postData.post.imageUrl} alt='' />
          </figure>
          <section className='side-bar'>
            <Owner
              owner={postData.post.owner}
              profilePicture={postData.photoURL}
            />
            <section className='comments'>
              <Caption
                owner={postData.post.owner}
                photoURL={postData.photoURL}
                caption={postData.post.caption}
              />
              {postData.post.comments.map((commentObj) => (
                <Comment key={commentObj.key} commentObj={commentObj} />
              ))}
            </section>
            <section className='interact'>
              <ButtonBar
                userLikes={postData.userLikes}
                likePost={likePost}
                disableComments={postData.post.disableComments}
                postId={postData.post.id}
              />
              <Likes likeCount={postData.likeCount} />
              <DatePosted timestamp={postData.post.timestamp} />
            </section>
            <AddComment
              updateCommentsArray={updateCommentsArray}
              post={postData.post}
            />
          </section>
        </div>
      </>
    );
  };

  return loading ? <Loading /> : renderPost();
};

HorizontalPost.defaultProps = {
  modal: false,
};

HorizontalPost.propTypes = {
  modal: PropTypes.bool,
};

export default HorizontalPost;
