import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import UserContext from '../../../Context/UserContext';
import { uploadNewPost } from '../../../firebase';
import './SetCaption.css';

const SetCaption = ({ image, updateAddModal }) => {
  const { user } = useContext(UserContext);

  const [text, setText] = useState('');
  const [disableCommenting, setDisableCommenting] = useState(false);

  const [error, setError] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadNewPost(image, text, disableCommenting).then((res) => {
      if (typeof res === 'string') setError(res);
      else updateAddModal(false);
    });
  };

  return (
    <div className='set-caption'>
      <figure className='image'>
        <img src={image.url} alt='' />
      </figure>
      <form className='form'>
        <div className='poster'>
          <img src={user.photoURL} alt='' />
          <h3>{user.displayName}</h3>
        </div>
        <textarea
          name='caption-text'
          id=''
          cols='30'
          rows='10'
          placeholder='Write a caption...'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label htmlFor='disable-commenting'>
          Turn Off Commenting?
          <input
            type='checkbox'
            id='disable-commenting'
            checked={disableCommenting}
            onChange={(e) => setDisableCommenting(e.target.checked)}
          />
        </label>
        <button type='submit' onClick={(e) => handleSubmit(e)}>
          Share
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

SetCaption.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateAddModal: PropTypes.func.isRequired,
};

export default SetCaption;
