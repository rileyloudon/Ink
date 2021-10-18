/* eslint-disable react/jsx-props-no-spreading */
import { useRef, useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { photo } from '../../img/index';
import './AddPhoto.css';

const AddPhoto = ({ updateAddModal }) => {
  const modal = useRef();
  const [dropRejected, setDropRejected] = useState(false);
  const [image, setImage] = useState();

  const onDropAccepted = useCallback((acceptedFiles) => {
    setImage(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const onDropRejected = useCallback(() => {
    setDropRejected(true);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    accept: 'image/jpeg, image/png',
    noClick: true,
    noKeyboard: true,
    onDropAccepted,
    onDropRejected,
  });

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
      <div {...getRootProps({ className: 'dropzone' })}>
        <button
          className='close'
          aria-label='close'
          type='button'
          onClick={() => updateAddModal(false)}
        >
          &#x2715;
        </button>
        <input {...getInputProps()} />
        {!image && (
          <>
            <img
              src={!dropRejected ? photo.photoDefault : photo.photoError}
              alt=''
            />
            <h3>
              {!dropRejected
                ? 'Drag Photos Here.'
                : 'This file type is not supported.'}
            </h3>
            {dropRejected && <p>Please use .jpeg or .png</p>}
            <button
              className='select-from-computer'
              type='button'
              onClick={open}
            >
              Select From Computer
            </button>
          </>
        )}
        {image && (
          <img
            style={{ width: '150px', height: 'auto' }}
            src={image}
            alt='test'
          />
        )}
      </div>
    </div>
  );
};

AddPhoto.propTypes = {
  updateAddModal: PropTypes.func.isRequired,
};

export default AddPhoto;
