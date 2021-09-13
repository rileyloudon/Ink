import logo from '../../img/misc/octopus-small.png';
import './Loading.css';

const Loading = () => {
  return (
    <div className='loading-logo'>
      <img src={logo} alt='Loading...' />
    </div>
  );
};

export default Loading;
