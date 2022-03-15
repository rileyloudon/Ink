import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers } from '../../../firebase';
import './Search.css';

const Search = () => {
  const searchResultsRef = useRef();
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState();
  const [resultsOpen, setResultsOpen] = useState(false);

  const handleClick = () => setResultsOpen(!resultsOpen);

  const handleSearch = (e) => {
    setSearchString(e.target.value);
    searchUsers(e.target.value).then((res) => {
      setResults(res);
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchResultsRef.current !== null &&
        !searchResultsRef.current.contains(e.traget)
      ) {
        setResultsOpen(!resultsOpen);
      }
    };

    if (resultsOpen) window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [resultsOpen]);

  const displaySearchResult = (user) => {
    return (
      <Link to={`/${user.username}`} key={user.username}>
        <img src={user.photoURL} alt='' />
        <span>{user.username}</span>
      </Link>
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
        onClick={handleClick}
        onChange={(e) => handleSearch(e)}
      />
      <div
        ref={searchResultsRef}
        className={`search-results ${resultsOpen ? 'displayed' : ''}`}
      >
        {results && results.map((user) => displaySearchResult(user))}
      </div>
    </div>
  );
};

export default Search;
