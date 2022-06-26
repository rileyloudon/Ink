import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DropImage from './DropImage/DropImage';
import SetCaption from './SetCaption/SetCaption';
import './AddPost.css';

const AddPost = ({ updateAddModal }) => {
  const modal = useRef();
  const [image, setImage] = useState({ properties: '', url: '' });

  const updateImage = (properties, url) => {
    setImage({ properties, url });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modal.current && !modal.current.contains(e.target))
        updateAddModal(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      URL.revokeObjectURL(image.url);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [updateAddModal, image]);

  return (
    <div className='dropzone-container'>
      <article ref={modal} className='modal'>
        <div className='top-bar'>
          <h2>{!image.properties ? 'New Post' : 'Caption'}</h2>
          <button
            className='close'
            aria-label='close'
            type='button'
            onClick={() => updateAddModal(false)}
          >
            &#x2715;
          </button>
        </div>
        {!image.properties ? (
          <DropImage updateImage={updateImage} />
        ) : (
          <SetCaption image={image} updateAddModal={updateAddModal} />
        )}
      </article>
    </div>
  );
};

AddPost.propTypes = {
  updateAddModal: PropTypes.func.isRequired,
};

export default AddPost;
