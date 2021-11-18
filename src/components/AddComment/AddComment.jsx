import React, { useState } from 'react';
import { Picker } from 'emoji-mart';
import { emoji } from '../../img';
import './AddComment.css';
import 'emoji-mart/css/emoji-mart.css';

const AddComment = () => {
  const [comment, setComment] = useState('');
  const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);

  const selectEmoji = (emojiObject) => {
    setComment((currentComment) => currentComment + emojiObject.native);
  };

  return (
    <>
      {displayEmojiPicker && (
        <Picker
          showPreview={false}
          showSkinTones={false}
          native
          sheetSize={16}
          perLine={7}
          onSelect={selectEmoji}
        />
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
          <img src={emoji.darkFace} alt='' />
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
