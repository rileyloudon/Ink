/* eslint-disable react/jsx-props-no-spreading */
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { photo } from '../../../img/index';
import './DropImage.css';

const DropImage = ({ updateImage, updateAddModal }) => {
  const [dropRejected, setDropRejected] = useState(false);

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      updateImage(URL.createObjectURL(acceptedFiles[0]));
    },
    [updateImage]
  );

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

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <div className='top-bar'>
        <h2>New Post</h2>
        <button
          className='close'
          aria-label='close'
          type='button'
          onClick={() => updateAddModal(false)}
        >
          &#x2715;
        </button>
      </div>
      <input {...getInputProps()} />
      <img src={!dropRejected ? photo.photoDefault : photo.photoError} alt='' />
      <h3>
        {!dropRejected
          ? 'Drag Photos Here.'
          : 'This file type is not supported.'}
      </h3>
      {dropRejected && <p>Please use .jpeg or .png</p>}
      <button className='select-from-computer' type='button' onClick={open}>
        Select From Computer
      </button>
    </div>
  );
};

DropImage.propTypes = {
  updateAddModal: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
};

export default DropImage;
