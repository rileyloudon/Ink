import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DropImage from './DropImage/DropImage';
import './AddPost.css';
import Caption from './Caption/Caption';

const AddPost = ({ updateAddModal }) => {
  const modal = useRef();
  const [image, setImage] = useState();

  const updateImage = (value) => setImage(value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modal.current.className !== e.target.className) return;

      updateAddModal(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    URL.revokeObjectURL(image);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [updateAddModal, image]);

  return (
    <div ref={modal} className='dropzone-container'>
      <div className='modal'>
        <div className='top-bar'>
          <h2>{!image ? 'New Post' : 'Caption'}</h2>
          <button
            className='close'
            aria-label='close'
            type='button'
            onClick={() => updateAddModal(false)}
          >
            &#x2715;
          </button>
        </div>
        {!image ? (
          <DropImage
            updateImage={updateImage}
            updateAddModal={updateAddModal}
          />
        ) : (
          <Caption image={image} updateAddModal={updateAddModal} />
        )}
      </div>
    </div>
  );
};

AddPost.propTypes = {
  updateAddModal: PropTypes.func.isRequired,
};

export default AddPost;
