import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers } from '../../../firebase';
import './Search.css';

const Search = () => {
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState();

  const handleSearch = (e) => {
    setSearchString(e.target.value);
    searchUsers(e.target.value).then((res) => {
      setResults(res);
    });
  };

  const displaySearchResult = (user) => {
    return (
      <div className='search-user' key={user.username}>
        <Link to={`/${user.username}`}>
          <img src={user.photoURL} alt='' />
          <span>{user.username}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className='search'>
      <input
        className='search-box'
        type='text'
        placeholder='Search'
        autoCapitalize='none'
        value={searchString}
        onChange={(e) => handleSearch(e)}
      />
      {results && results.map((user) => displaySearchResult(user))}
    </div>
  );
};

export default Search;
