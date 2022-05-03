/* eslint-disable react/jsx-props-no-spreading */
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { ReactComponent as PhotoDefault } from '../../../img/photo/photo-default.svg';
import { ReactComponent as PhotoError } from '../../../img/photo/photo-error.svg';
import './DropImage.css';

const DropImage = ({ updateImage }) => {
  const [dropRejected, setDropRejected] = useState(false);

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      // First variable is the file with properties, second is a link to the picture
      updateImage(acceptedFiles[0], URL.createObjectURL(acceptedFiles[0]));
    },
    [updateImage]
  );

  const onDropRejected = useCallback((rejectedFile) => {
    if (rejectedFile[0].file.size > 5000000)
      setDropRejected('This file is too large');
    else setDropRejected('This file type is not supported');
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    accept: 'image/jpeg, image/png',
    maxSize: 5000000, // 5 MB
    noClick: true,
    noKeyboard: true,
    onDropAccepted,
    onDropRejected,
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {!dropRejected ? <PhotoDefault /> : <PhotoError />}
      <h3>{!dropRejected ? 'Drag Photos Here' : dropRejected}</h3>
      {dropRejected && (
        <p className='drop-rejected'>
          Please use a .jpeg or .png that is less than 5MB
        </p>
      )}
      <button className='select-from-computer' type='button' onClick={open}>
        Select From Computer
      </button>
    </div>
  );
};

DropImage.propTypes = {
  updateImage: PropTypes.func.isRequired,
};

export default DropImage;
