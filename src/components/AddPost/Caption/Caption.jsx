import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import UserContext from '../../../Context/UserContext';
import { savePost } from '../../../firebase';
import './Caption.css';

const Caption = ({ image, updateAddModal }) => {
  const { user } = useContext(UserContext);

  const [text, setText] = useState('');
  const [disableCommenting, setDisableCommenting] = useState(false);

  const [error, setError] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    savePost(image, text, disableCommenting).then((res) => {
      if (typeof res === 'string') setError(res);
      else updateAddModal(false);
    });
  };

  return (
    <div className='caption'>
      <figure className='image'>
        <img src={image.url} alt='test' />
      </figure>
      <form className='form'>
        <img src={user.photoURL} alt='' />
        <h3>{user.displayName}</h3>
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
          Turn Off Commenting
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

Caption.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateAddModal: PropTypes.func.isRequired,
};

export default Caption;
