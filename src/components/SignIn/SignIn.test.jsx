import { fireEvent, render } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import SignIn from './SignIn';

test('Sign in button stays disabled', () => {
  const { queryByText, queryByPlaceholderText } = render(
    <HashRouter>
      <UserContext.Provider value='undefined'>
        <SignIn updateLoading={() => {}} signInGuest={() => {}} />
      </UserContext.Provider>
    </HashRouter>
  );
  const button = queryByText('Log In');
  const email = queryByPlaceholderText('Email');
  const password = queryByPlaceholderText('Password');

  expect(button).toBeDisabled();

  // Missing '@' in email
  fireEvent.change(email, { target: { value: 'emailemail.com' } });
  fireEvent.change(password, { target: { value: 'password' } });
  expect(button).toBeDisabled();

  // Missing start of email
  fireEvent.change(email, { target: { value: '@email.com' } });
  expect(button).toBeDisabled();

  // Password is less than 6 characters
  fireEvent.change(email, { target: { value: 'email@email.com' } });
  fireEvent.change(password, { target: { value: 'pass' } });
  expect(button).toBeDisabled();
});

test('Sign in button becomes enabled', () => {
  const { queryByText, queryByPlaceholderText } = render(
    <HashRouter>
      <UserContext.Provider value='undefined'>
        <SignIn updateLoading={() => {}} signInGuest={() => {}} />
      </UserContext.Provider>
    </HashRouter>
  );
  const button = queryByText('Log In');
  const email = queryByPlaceholderText('Email');
  const password = queryByPlaceholderText('Password');

  expect(button).toBeDisabled();

  fireEvent.change(email, { target: { value: 'email@email.com' } });
  fireEvent.change(password, { target: { value: 'password' } });

  expect(button).toBeEnabled();
});
