import React from 'react';
import PropTypes from 'prop-types';
import './DatePosted.css';

const DatePosted = ({ timestamp }) => {
  const postedDate = () => {
    const postDate = timestamp.toDate();
    const todaysDate = new Date();
    const thisCalendarYear =
      todaysDate.getFullYear() === postDate.getFullYear();
    const difference = Math.round((todaysDate - postDate) / 1000);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    if (!thisCalendarYear)
      return `${
        monthNames[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}`;

    if (difference >= 604800 && thisCalendarYear)
      return `${monthNames[postDate.getMonth()]} ${postDate.getDate()}`;

    // Days -> Max '6 days ago', then display actual date
    if (difference >= 172800 && difference <= 604799)
      return `${Math.floor(difference / (60 * 60 * 24))} days ago`;
    if (difference >= 86400 && difference <= 172799)
      return `${Math.floor(difference / (60 * 60 * 24))} day ago`;

    // Hours
    if (difference >= 7200 && difference <= 86399)
      return `${Math.floor(difference / (60 * 60))} hours ago`;
    if (difference >= 3600 && difference <= 7199)
      return `${Math.floor(difference / (60 * 60))} hour ago`;

    // Minutes
    if (difference >= 120 && difference <= 3599)
      return `${Math.floor(difference / 60)} minutes ago`;
    if (difference >= 60 && difference <= 119)
      return `${Math.floor(difference / 60)} minute ago`;

    // Seconds
    if (difference >= 2 && difference <= 59) return `${difference} seconds ago`;
    return `1 second ago`;
  };

  return (
    <div className='date'>
      <time>{postedDate()}</time>
    </div>
  );
};

DatePosted.propTypes = {
  timestamp: PropTypes.shape({
    toDate: PropTypes.func,
  }).isRequired,
};

export default DatePosted;
