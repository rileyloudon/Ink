import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import UserContext from '../../../Context/UserContext';
import { deletePost, fetchIndividualPost, updatePost } from '../../../firebase';
import './EditPost.css';

const EditPost = () => {
  const { user } = useContext(UserContext);
  const { username, postId } = useParams();

  const [postData, setPostData] = useState();
  const [caption, setCaption] = useState('');
  const [disableComments, setDisableComments] = useState(false);
  const [hideComments, setHideComments] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState();

  const [postUpdated, setPostUpdated] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const changedData =
    typeof postData === 'object'
      ? postData.post.caption !== caption ||
        postData.post.disableComments !== disableComments ||
        postData.post.hideComments !== hideComments
      : null;

  const savePost = async () => {
    const changed = {
      caption: postData.caption !== caption,
      disableComments: postData.disableComments !== disableComments,
      hideComments: postData.hideComments !== hideComments,
    };

    setButtonLoading(true);
    const res = await updatePost(
      postId,
      changed,
      caption,
      disableComments,
      hideComments
    );

    if (res.updated === true) {
      setPostData((prevData) => ({
        ...prevData,
        caption,
        disableComments,
        hideComments,
      }));
      setPostUpdated('Post Updated');
    } else {
      setError(res.err);
      setPostUpdated(false);
    }
    setButtonLoading(false);
  };

  const handleDelete = async () => {
    const status = await deletePost(postId);
    if (status.deleted === true) setPostUpdated('Post Deleted');
    else setError(status.err.message);
  };

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      const res = await fetchIndividualPost(username, postId);
      if (isSubscribed) {
        setPostData(res);
        if (typeof res === 'object') {
          setCaption(res.post.caption);
          setDisableComments(res.post.disableComments);
          setHideComments(res.post.hideComments);
        }
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [username, postId]);

  if (user && user.username !== username) {
    return <h3 className='not-your-post'>You can only edit your own posts</h3>;
  }

  if (postData === 'Post not found' || postData === 'User not found')
    return (
      <div className='edit-post-error'>
        <h2>{postData}.</h2>
        <p>Please double check the URL to make sure it&#39;s correct.</p>
      </div>
    );

  return postData ? (
    <>
      <section className='post-preview'>
        <figure className='post-image'>
          <img src={postData.post.imageUrl} alt='' />
        </figure>
        <div className='stats'>
          <p>Likes: {postData.likeCount}</p>
          <p>Comments: {postData.post.comments.length}</p>
        </div>
      </section>
      <section className='post-settings'>
        <form>
          <label htmlFor='change-caption' className='input'>
            <p>Caption</p>
            <textarea
              name='bio'
              id='change-bio'
              value={caption}
              onClick={(e) => {
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onChange={(e) => {
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
                setCaption(e.target.value);
              }}
            />
          </label>
          <label htmlFor='toggle-disable-comments' className='disable-comments'>
            <span>Disable Comments</span>
            <input
              type='checkbox'
              name='toggle-disable-comments'
              id='toggle-disable-comments'
              checked={disableComments}
              onChange={(e) => setDisableComments(e.target.checked)}
            />
            <span className='checkmark' />
          </label>
          <label htmlFor='toggle-hide-comments' className='hide-comments'>
            <span>Hide Comments</span>
            <input
              type='checkbox'
              name='toggle-hide-comments'
              id='toggle-hide-comments'
              checked={hideComments}
              onChange={(e) => setHideComments(e.target.checked)}
            />
            <span className='checkmark' />
          </label>
          {postUpdated && <p className='post-updated'>{postUpdated}</p>}
          {error && <p className='error'>{error}</p>}
          <button
            className='save'
            type='button'
            disabled={!changedData}
            onClick={savePost}
          >
            {!buttonLoading ? 'Save' : 'Saving'}
            {buttonLoading && <Spinner className='spinner' />}
          </button>
        </form>
        {!confirmDelete && (
          <button
            type='button'
            className='delete-post'
            onClick={() => setConfirmDelete(true)}
          >
            Delete Post
          </button>
        )}
        {confirmDelete && (
          <div className='confirm-delete'>
            <p>Are you sure you wish the delete this post?</p>
            <button type='button' className='delete' onClick={handleDelete}>
              Delete
            </button>
            <button
              type='button'
              className='cancel'
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </>
  ) : null;
};

export default EditPost;
