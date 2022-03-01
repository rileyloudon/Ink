import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import UserContext from '../../../Context/UserContext';
import { fetchIndividualPost, updatePost } from '../../../firebase';
import './EditPost.css';

const EditPost = () => {
  const { user } = useContext(UserContext);
  const { username, postId } = useParams();

  const [postData, setPostData] = useState();
  const [caption, setCaption] = useState('');
  const [disableComments, setDisableComments] = useState();
  const [hideComments, setHideComments] = useState();
  const [error, setError] = useState();

  const [postUpdated, setPostUpdeated] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const changedData =
    typeof postData === 'object'
      ? postData.caption !== caption ||
        postData.disableComments !== disableComments ||
        postData.hideComments !== hideComments
      : null;

  const savePost = () => {
    const changed = {
      caption: postData.caption !== caption,
      disableComments: postData.disableComments !== disableComments,
      hideComments: postData.hideComments !== hideComments,
    };

    setButtonLoading(true);
    updatePost(changed, caption, disableComments, hideComments).then((res) => {
      if (res.updated === true) {
        setPostData((prevData) => ({
          ...prevData,
          caption,
          disableComments,
          hideComments,
        }));
        setPostUpdeated(true);
      } else {
        setError(res.err);
        setPostUpdeated(false);
      }
      setButtonLoading(false);
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchIndividualPost(username, postId).then((res) => {
      if (isSubscribed) {
        setPostData(res);
        if (typeof res === 'object') {
          setCaption(res.caption);
          setDisableComments(res.disableComments);
          setHideComments(res.hideComments);
        }
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [username, postId]);

  if (user && user.username !== username) {
    return <h3 className='not-your-post'>You can only edit your own posts</h3>;
  }

  if (postData === 'Post not found' || postData === 'User not found')
    <div className='post-error'>
      <h2>{postData}.</h2>
      <p>Please double check the URL to make sure it&#39;s correct.</p>
    </div>;

  return (
    <>
      <div className='post-settings'>
        <form>
          <label htmlFor='change-caption' className='input'>
            <p>Caption</p>
            <input
              type='text'
              id='change-caption'
              name='change-caption'
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
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
          {postUpdated && <p className='profile-updated'>Profile Updated</p>}
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
        <button type='button' className='delete-post'>
          Delete Post
        </button>
      </div>
    </>
  );
};

export default EditPost;
