import { Picker } from 'emoji-mart';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './EmojiPicker.css';

const EmojiPicker = ({ updateDisplayEmojiPicker, selectEmoji }) => {
  const picker = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        picker.current &&
        !picker.current.contains(e.target) &&
        e.target.tagName !== 'svg' &&
        e.target.tagName !== 'path' &&
        e.target.tagName !== 'circle'
      )
        updateDisplayEmojiPicker(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [updateDisplayEmojiPicker]);

  return (
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
  );
};

EmojiPicker.propTypes = {
  updateDisplayEmojiPicker: PropTypes.func.isRequired,
  selectEmoji: PropTypes.func.isRequired,
};

export default EmojiPicker;
