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
import './VerticalPost.css';
import Owner from '../Owner/Owner';

const VerticalPost = ({ post }) => {
  const { user } = useContext(UserContext);

  const [profilePicture, setProfilePicture] = useState();
  const [postComments, setPostComments] = useState(post.comments);
  const [likeStatus, setLikeStatus] = useState(
    user
      ? {
          likeCount: post.likes.length,
          userLikes: post.likes.includes(user.displayName),
        }
      : null
  );

  const updateCommentsArray = (comments) => setPostComments(comments);

  const likePost = () => {
    toggleLikePost(post).then((res) => {
      // res returns if user liked the post
      if (res === true) {
        setLikeStatus((prevState) => ({
          likeCount: prevState.likeCount + 1,
          userLikes: true,
        }));
      } else if (res === false) {
        setLikeStatus((prevState) => ({
          likeCount: prevState.likeCount - 1,
          userLikes: false,
        }));
      }
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchProfilePicture(post.owner).then((res) => {
      if (isSubscribed) setProfilePicture(res);
    });
    return () => {
      isSubscribed = false;
    };
  }, [post.owner]);

  return (
    <div className='vertical-view'>
      <Owner owner={post.owner} profilePicture={profilePicture} />
      <figure className='post-image' onDoubleClick={likePost}>
        <img src={post.imageUrl} alt='' />
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
          {postComments.map((commentObj) => (
            <Comment
              key={commentObj.key}
              commentObj={commentObj}
              includePicture={false}
            />
          ))}
          <DatePosted marginBottom={16} timestamp={post.timestamp} />
        </section>
        <AddComment updateCommentsArray={updateCommentsArray} post={post} />
      </section>
    </div>
  );
};

VerticalPost.propTypes = {
  post: PropTypes.shape({
    caption: PropTypes.string,
    imageUrl: PropTypes.string,
    owner: PropTypes.string,
    id: PropTypes.string,
    disableComments: PropTypes.bool,
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
