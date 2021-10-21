import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import UserContext from '../../../Context/UserContext';
import './Caption.css';

const Caption = ({ image }) => {
  const { user } = useContext(UserContext);

  const [text, setText] = useState('');
  const [disableCommenting, setDisableCommenting] = useState(false);

  return (
    <div className='caption'>
      <figure className='image'>
        <img src={image} alt='test' />
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
        <button
          type='submit'
          onClick={(e) => {
            e.preventDefault();
            console.log(text, disableCommenting);
          }}
        >
          Share
        </button>
      </form>
    </div>
  );
};

Caption.propTypes = {
  image: PropTypes.string.isRequired,
};

export default Caption;
