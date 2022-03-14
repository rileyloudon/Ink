import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers } from '../../../firebase';
import './Search.css';

const Search = () => {
  const search = useRef();
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState();

  const handleSearch = (e) => {
    setSearchString(e.target.value);
    searchUsers(e.target.value).then((res) => {
      setResults(res);
    });
  };

  const handleClickOutside = (e) => {
    if (
      search.current &&
      !search.current.contains(e.target) &&
      document.getElementById(`search-results`).classList.contains('displayed')
    ) {
      document.getElementById(`search-results`).classList.remove('displayed');
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  const handleClick = () => {
    const searchResults = document.getElementById(`search-results`);

    if (searchResults.classList.contains('displayed'))
      document.removeEventListener('mousedown', handleClickOutside);
    else
      document.addEventListener('mousedown', handleClickOutside, {
        once: true,
      });
    searchResults.classList.toggle('displayed');
  };

  const removeEverything = () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.getElementById(`search-results`).classList.remove('displayed');
  };

  const displaySearchResult = (user) => {
    return (
      <Link
        to={`/${user.username}`}
        key={user.username}
        onClick={removeEverything}
      >
        <img src={user.photoURL} alt='' />
        <span>{user.username}</span>
      </Link>
    );
  };

  return (
    <div ref={search} className='search'>
      <input
        className='search-box'
        type='text'
        placeholder='Search'
        autoCapitalize='none'
        value={searchString}
        onClick={handleClick}
        onChange={(e) => handleSearch(e)}
      />
      <div id='search-results'>
        {results && results.map((user) => displaySearchResult(user))}
      </div>
    </div>
  );
};

export default Search;
