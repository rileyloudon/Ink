import { PropTypes } from 'prop-types';
import logo from '../../img/misc/octopus-small.png';
import './Loading.css';

const Loading = ({ modal }) => {
  return (
    <>
      {modal && <div className='loading-backdrop' />}
      <img src={logo} alt='Loading...' className='loading-logo' />
    </>
  );
};

Loading.defaultProps = {
  modal: false,
};

Loading.propTypes = {
  modal: PropTypes.bool,
};

export default Loading;
