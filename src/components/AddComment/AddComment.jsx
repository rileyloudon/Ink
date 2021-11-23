import { useState, useRef, useEffect } from 'react';
import { Picker } from 'emoji-mart';
import { emoji } from '../../img';
import './AddComment.css';
import 'emoji-mart/css/emoji-mart.css';

const AddComment = () => {
  const picker = useRef();
  const [comment, setComment] = useState('');
  const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);

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

  return (
    <>
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

      <section className='add-comment'>
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
        <textarea
          id='textarea'
          placeholder='Add a comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className='post-btn'
          type='button'
          disabled={comment.length < 1}
        >
          Post
        </button>
      </section>
    </>
  );
};

export default AddComment;
