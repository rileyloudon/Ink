import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Comment from '../Comment/Comment';
import AddComment from '../AddComment/AddComment';
import { fetchProfilePicture, toggleLikePost } from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import ButtonBar from '../ButtonBar/ButtonBar';
import Likes from '../Likes/Likes';
import DatePosted from '../DatePosted/DatePosted';
import Caption from '../Caption/Caption';
import Owner from '../Owner/Owner';
import './VerticalPost.css';

const VerticalPost = ({ post }) => {
  const { user } = useContext(UserContext);

  const [profilePicture, setProfilePicture] = useState();
  const [displayedPostComments, setDisplayedPostComments] = useState(
    post.comments.slice(-3)
  );
  const [hiddenPostComments, setHiddenPostComments] = useState(
    post.comments.length > 3 ? post.comments.slice(0, -3) : null
  );
  const [likeStatus, setLikeStatus] = useState(
    user
      ? {
          likeCount: post.likes.length,
          userLikes: post.likes.includes(user.username),
        }
      : null
  );

  const addNewComment = (comment) =>
    setDisplayedPostComments((prevState) => [...prevState, comment]);

  const deleteDisplayedComment = (commentToDelete) => {
    const tempArray = displayedPostComments.filter(
      (comment) => comment !== commentToDelete
    );
    setDisplayedPostComments(tempArray);
  };

  const likePost = async () => {
    if (likeStatus.userLikes) {
      setLikeStatus((prevState) => ({
        likeCount: prevState.likeCount - 1,
        userLikes: false,
      }));
    } else {
      setLikeStatus((prevState) => ({
        likeCount: prevState.likeCount + 1,
        userLikes: true,
      }));
    }

    await toggleLikePost(post);
  };

  const loadMoreComments = () => {
    setDisplayedPostComments((currentComments) => [
      ...hiddenPostComments.slice(-3),
      ...currentComments,
    ]);

    setHiddenPostComments(hiddenPostComments.slice(0, -3));
  };

  const renderComments = () => {
    if (post.hideComments)
      return (
        <span className='comments-hidden'>
          {post.owner} has hidden the comments
        </span>
      );

    return (
      <>
        {hiddenPostComments && hiddenPostComments.length > 0 && (
          <button
            type='button'
            className='more-comments'
            onClick={loadMoreComments}
          >
            View more comments
          </button>
        )}
        {displayedPostComments.map((commentObj) => (
          <Comment
            key={commentObj.key}
            post={post}
            commentObj={commentObj}
            includePicture={false}
            deleteDisplayedComment={deleteDisplayedComment}
          />
        ))}
      </>
    );
  };

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      const res = await fetchProfilePicture(post.owner);
      if (isSubscribed) setProfilePicture(res);
    })();

    return () => {
      isSubscribed = false;
    };
  }, [post.owner]);

  return (
    <article className='vertical-view'>
      <Owner owner={post.owner} profilePicture={profilePicture} id={post.id} />
      <figure className='post-image' onDoubleClick={likePost}>
        <img src={post.imageUrl} alt='' loading='eager' />
      </figure>
      <section className='bottom-bar'>
        <section className='interact'>
          <ButtonBar
            userLikes={likeStatus.userLikes}
            likePost={likePost}
            disableComments={post.disableComments}
            postId={post.id}
          />
          <Likes likeCount={likeStatus.likeCount} />
        </section>
        <section className='comments'>
          <Caption owner={post.owner} caption={post.caption} />
          {renderComments()}
          <DatePosted timestamp={post.timestamp} />
        </section>
        {!post.disableComments && (
          <AddComment addNewComment={addNewComment} post={post} />
        )}
      </section>
    </article>
  );
};

VerticalPost.propTypes = {
  post: PropTypes.shape({
    caption: PropTypes.string,
    imageUrl: PropTypes.string,
    owner: PropTypes.string,
    id: PropTypes.string,
    disableComments: PropTypes.bool,
    hideComments: PropTypes.bool,
    likes: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        comment: PropTypes.string,
        by: PropTypes.string,
      })
    ),
    timestamp: PropTypes.shape({}),
  }).isRequired,
};

export default VerticalPost;
