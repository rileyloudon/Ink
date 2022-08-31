import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import UserContext from '../../../Context/UserContext';
import { uploadNewPost } from '../../../firebase';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import './SetCaption.css';

const SetCaption = ({ image, updateAddModal }) => {
  const { user } = useContext(UserContext);

  const [text, setText] = useState('');
  const [disableCommenting, setDisableCommenting] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    setButtonLoading(true);
    e.preventDefault();

    const res = await uploadNewPost(image.blob, text, disableCommenting);

    if (typeof res === 'string') {
      setError(res);
      setButtonLoading(false);
    } else updateAddModal(false);
  };

  return (
    <div className='set-caption'>
      <figure className='image'>
        <img src={image.url} alt='' />
      </figure>
      <form className='form'>
        <div className='poster'>
          <img src={user.photoURL} alt='' />
          <h3>{user.username}</h3>
        </div>
        <textarea
          name='caption-text'
          id=''
          placeholder='Write a caption...'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label htmlFor='disable-commenting'>
          <span>Turn Off Commenting?</span>
          <input
            type='checkbox'
            id='disable-commenting'
            checked={disableCommenting}
            onChange={(e) => setDisableCommenting(e.target.checked)}
          />
          <span className='checkmark' />
        </label>
        <button type='submit' onClick={(e) => handleSubmit(e)}>
          {!buttonLoading ? 'Share' : 'Sharing'}
          {buttonLoading && <Spinner className='spinner' />}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

SetCaption.propTypes = {
  image: PropTypes.shape({
    blob: PropTypes.shape({}).isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  updateAddModal: PropTypes.func.isRequired,
};

export default SetCaption;
