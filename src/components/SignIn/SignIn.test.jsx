import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event/';
import { HashRouter } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import SignIn from './SignIn';

beforeEach(() => {
  render(
    <HashRouter>
      <UserContext.Provider value='undefined'>
        <SignIn updateLoading={() => {}} signInGuest={() => {}} />
      </UserContext.Provider>
    </HashRouter>
  );
});

test('Sign in button stays disabled', async () => {
  const user = userEvent.setup();
  const button = screen.getByText('Sign In');
  const email = screen.getByPlaceholderText('Email');
  const password = screen.getByPlaceholderText('Password');
  expect(button).toBeDisabled();

  // Missing '@' in email
  await user.type(email, 'emailemail.com');
  await user.type(password, 'password');
  expect(button).toBeDisabled();

  // Missing start of email
  await user.clear(email);
  await user.type(email, '@email.com');
  expect(button).toBeDisabled();

  // Password is less than 6 characters
  await user.clear(email);
  await user.clear(password);
  await user.type(email, 'email@email.com');
  await user.type(password, 'pass');
  expect(button).toBeDisabled();
});

test('Sign in button becomes enabled', async () => {
  const user = userEvent.setup();
  const button = screen.getByText('Sign In');
  const email = screen.getByPlaceholderText('Email');
  const password = screen.getByPlaceholderText('Password');

  expect(button).toBeDisabled();

  await user.type(email, 'email@email.com');
  await user.type(password, 'password');

  expect(button).toBeEnabled();
});
