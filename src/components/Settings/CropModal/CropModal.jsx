import { PropTypes } from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import './CropModal.css';

const CropModal = ({ picture, updatePicture, updateModal }) => {
  const modal = useRef();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();

  const onCropComplete = useCallback((croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const saveCroppedImage = useCallback(async () => {
    try {
      const croppedPicture = await getCroppedImg(picture, croppedAreaPixels);
      updatePicture(croppedPicture);
    } catch (e) {
      console.log(e);
    }
  }, [croppedAreaPixels, picture, updatePicture]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modal.current && !modal.current.contains(e.target))
        updateModal(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      URL.revokeObjectURL(picture);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [updateModal, picture]);

  return (
    <div className='crop-modal'>
      <div className='crop-container' ref={modal}>
        <div className='crop-top'>
          <h2>Crop Image</h2>
          <button
            className='close'
            aria-label='close'
            type='button'
            onClick={() => updateModal(false)}
          >
            &#x2715;
          </button>
        </div>
        <div className='cropper'>
          <Cropper
            image={picture}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape='round'
          />
        </div>
        <button className='save-crop' type='button' onClick={saveCroppedImage}>
          Crop
        </button>
      </div>
    </div>
  );
};

CropModal.propTypes = {
  picture: PropTypes.string.isRequired,
  updatePicture: PropTypes.func.isRequired,
  updateModal: PropTypes.func.isRequired,
};

export default CropModal;
