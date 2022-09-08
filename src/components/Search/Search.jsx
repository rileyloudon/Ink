import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { searchUsers } from '../../firebase';
import './Search.css';

const Search = ({ updateCurrentSelectedUser, updateActiveTab }) => {
  const searchResultsRef = useRef(null);
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState();
  const [resultsOpen, setResultsOpen] = useState(false);

  const handleClick = async () => {
    setResultsOpen(true);

    if (!results) {
      const matchingUsers = await searchUsers('');
      setResults(matchingUsers);
    }
  };

  const handleSearch = async (e) => {
    setSearchString(e.target.value);

    const matchingUsers = await searchUsers(e.target.value.toLowerCase());
    setResults(matchingUsers);
  };

  // focus any text currently in search box
  const handleFocus = (e) => e.target.select();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchResultsRef.current !== null &&
        !searchResultsRef.current.contains(e.traget) &&
        e.target.className !== 'search-box'
      ) {
        setResultsOpen(false);
        document.querySelector('.search-box').blur();
      }
    };
    if (resultsOpen) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [resultsOpen]);

  const displaySearchResult = (user) => {
    if (updateCurrentSelectedUser) {
      return (
        <button
          className='search-item'
          type='button'
          key={user.username}
          onClick={() => {
            updateCurrentSelectedUser({
              username: user.username,
              photoURL: user.photoURL,
            });
            updateActiveTab('chatting');
          }}
        >
          <img src={user.photoURL} alt='' />
          <span>{user.username}</span>
        </button>
      );
    }

    return (
      <Link
        className='search-item'
        to={`/${user.username}`}
        key={user.username}
      >
        <img src={user.photoURL} alt='' />
        <span>{user.username}</span>
      </Link>
    );
  };

  return (
    <div className={`search ${updateCurrentSelectedUser ? 'search-chat' : ''}`}>
      <input
        className='search-box'
        type='search'
        placeholder='Search'
        autoCapitalize='none'
        value={searchString}
        onClick={handleClick}
        onChange={(e) => handleSearch(e)}
        onFocus={handleFocus}
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

Search.defaultProps = {
  updateCurrentSelectedUser: null,
  updateActiveTab: null,
};

Search.propTypes = {
  updateCurrentSelectedUser: PropTypes.func,
  updateActiveTab: PropTypes.func,
};
