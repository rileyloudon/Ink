/* eslint-disable react/jsx-props-no-spreading */
import { useRef, useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import './AddPhoto.css';

const AddPhoto = ({ updateAddModal }) => {
  const modal = useRef();
  const [message, setMessage] = useState('Drag Photos Here');
  const [image, setImage] = useState();

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length === 1)
      setMessage('Invalid File Type. Please use .jpeg or .png.');
    else {
      setImage(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    accept: 'image/jpeg, image/png',
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modal.current.contains(e.target)) return;

      updateAddModal(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    URL.revokeObjectURL(image);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [updateAddModal, image]);

  return (
    <div ref={modal} className='dropzone-contaienr'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>{message}</p>
        <button type='button' onClick={open}>
          Select From Computer
        </button>
        <img
          style={{ width: '150px', height: 'auto' }}
          src={image}
          alt='test'
        />
      </div>
    </div>
  );
};

AddPhoto.propTypes = {
  updateAddModal: PropTypes.func.isRequired,
};

export default AddPhoto;
