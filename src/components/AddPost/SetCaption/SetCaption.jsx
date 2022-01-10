import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import UserContext from '../../../Context/UserContext';
import { uploadNewPost } from '../../../firebase';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import { ReactComponent as Unchecked } from '../../../img/checkbox/unchecked.svg';
import { ReactComponent as Checked } from '../../../img/checkbox/checked.svg';
import './SetCaption.css';

const SetCaption = ({ image, updateAddModal }) => {
  const { user } = useContext(UserContext);

  const [text, setText] = useState('');
  const [disableCommenting, setDisableCommenting] = useState(false);
  const [error, setError] = useState();

  const [buttonLoading, setButtonLoading] = useState(false);

  const handleSubmit = (e) => {
    setButtonLoading(true);
    e.preventDefault();
    uploadNewPost(image, text, disableCommenting).then((res) => {
      if (typeof res === 'string') {
        setError(res);
        setButtonLoading(false);
      } else updateAddModal(false);
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
          {disableCommenting ? <Checked /> : <Unchecked />}
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
    url: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateAddModal: PropTypes.func.isRequired,
};

export default SetCaption;
