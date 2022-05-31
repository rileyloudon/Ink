import { useState } from 'react';
import PropTypes from 'prop-types';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import { ReactComponent as EmojiSvg } from '../../../img/emoji/emoji-face.svg';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import { addComment, sendMessage } from '../../../firebase';
import './AddComment.css';
import 'emoji-mart/css/emoji-mart.css';

const AddComment = ({
  addNewComment,
  post,
  chat,
  currentSelectedUser,
  disable,
}) => {
  const [comment, setComment] = useState('');
  const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (comment.trim().length >= 1) {
      setLoading(true);
      if (chat) {
        await sendMessage(currentSelectedUser, comment);
      } else {
        e.preventDefault();
        const newComment = await addComment(post, comment);
        addNewComment(newComment);
      }
      setComment('');
      setLoading(false);
    }
  };

  const updateDisplayEmojiPicker = (value) => setDisplayEmojiPicker(value);

  const selectEmoji = (emojiObject) =>
    setComment((currentComment) => currentComment + emojiObject.native);

  return (
    <section className='comment-box'>
      {displayEmojiPicker && (
        <EmojiPicker
          updateDisplayEmojiPicker={updateDisplayEmojiPicker}
          selectEmoji={selectEmoji}
        />
      )}

      <form className='add-comment' onSubmit={(e) => handleSubmit(e)}>
        <button
          type='button'
          className='emoji-btn'
          onClick={() =>
            displayEmojiPicker
              ? setDisplayEmojiPicker(false)
              : setDisplayEmojiPicker(true)
          }
        >
          <EmojiSvg />
        </button>
        <input
          autoComplete='off'
          id={chat ? `chat-textarea` : `${post.id}-textarea`}
          placeholder={chat ? 'Message' : 'Add a comment...'}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        {loading ? (
          <Spinner className='spinner' />
        ) : (
          <button
            className='post-btn'
            type='submit'
            disabled={comment.trim().length < 1 || disable}
          >
            {chat ? 'Send' : 'Post'}
          </button>
        )}
      </form>
    </section>
  );
};

AddComment.defaultProps = {
  addNewComment: null,
  post: null,
  chat: null,
  currentSelectedUser: null,
  disable: false,
};

AddComment.propTypes = {
  addNewComment: PropTypes.func,
  post: PropTypes.shape({
    id: PropTypes.string,
  }),
  chat: PropTypes.bool,
  currentSelectedUser: PropTypes.string,
  disable: PropTypes.bool,
};

export default AddComment;
