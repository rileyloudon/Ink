import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import { emoji } from '../../../img';
import { addComment } from '../../../firebase';
import './AddComment.css';
import 'emoji-mart/css/emoji-mart.css';

const AddComment = ({ updateCommentsArray, post }) => {
  const picker = useRef();
  const [comment, setComment] = useState('');
  const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    if (comment.trim().length >= 1) {
      e.preventDefault();
      addComment(post, comment).then((res) => {
        setComment('');
        updateCommentsArray(res);
      });
    }
  };

  const selectEmoji = (emojiObject) => {
    setComment((currentComment) => currentComment + emojiObject.native);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        picker.current &&
        !picker.current.contains(e.target) &&
        e.target.className !== 'happy-face'
      )
        setDisplayEmojiPicker(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return post.disableComments ? null : (
    <section className='comment-box'>
      {displayEmojiPicker && (
        <div ref={picker}>
          <Picker
            ref={picker}
            showPreview={false}
            showSkinTones={false}
            native
            sheetSize={16}
            perLine={7}
            onSelect={selectEmoji}
          />
        </div>
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
          <img className='happy-face' src={emoji.darkFace} alt='' />
        </button>
        <input
          autoComplete='off'
          id={`${post.id}-textarea`}
          placeholder='Add a comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          className='post-btn'
          type='submit'
          disabled={comment.trim().length < 1}
        >
          Post
        </button>
      </form>
    </section>
  );
};

AddComment.propTypes = {
  updateCommentsArray: PropTypes.func.isRequired,
  post: PropTypes.shape({
    id: PropTypes.string,
    disableComments: PropTypes.bool,
  }).isRequired,
};

export default AddComment;
