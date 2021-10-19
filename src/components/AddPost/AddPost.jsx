import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DropImage from './DropImage/DropImage';
import './AddPost.css';

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
      {!image ? (
        <DropImage updateImage={updateImage} updateAddModal={updateAddModal} />
      ) : (
        <img
          style={{ width: '150px', height: 'auto' }}
          src={image}
          alt='test'
        />
      )}
    </div>
  );
};

AddPost.propTypes = {
  updateAddModal: PropTypes.func.isRequired,
};

export default AddPost;
