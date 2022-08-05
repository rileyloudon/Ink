/* eslint-disable react/jsx-props-no-spreading */
import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserContext from './Context/UserContext';

function PrivateRoute({ children, ...rest }) {
  const { user } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={() => {
        return user || localStorage.getItem('userWillSignIn') ? (
          children
        ) : (
          <Redirect to='/' />
        );
      }}
    />
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.shape({}).isRequired,
};

export default PrivateRoute;
