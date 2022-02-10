/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import './ChangePicture.css';

const ChangePicture = ({ updateNewProfilePicture }) => {
  const [pictureRejected, setPictureRejected] = useState(false);

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      updateNewProfilePicture({
        properties: acceptedFiles[0],
        url: URL.createObjectURL(acceptedFiles[0]),
      });
      setPictureRejected(false);
    },
    [updateNewProfilePicture]
  );

  const onDropRejected = useCallback((rejectedFile) => {
    if (rejectedFile[0].file.size > 5000000)
      setPictureRejected('Please select a picture that is less than 5MB');
    else setPictureRejected('Please select a .jpeg or .png file');
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    accept: 'image/jpeg, image/png',
    maxSize: 5000000, // 5MB
    noClick: true,
    noKeyboard: true,
    noDrag: true,
    onDropAccepted,
    onDropRejected,
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <button className='change-profile-picture' type='button' onClick={open}>
        Change Profile Picture
      </button>
      {pictureRejected && <p className='error'>{pictureRejected}</p>}
    </div>
  );
};

ChangePicture.propTypes = {
  updateNewProfilePicture: PropTypes.func.isRequired,
};

export default ChangePicture;
