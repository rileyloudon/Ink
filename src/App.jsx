import { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header/Header';
import Home from './components/Home';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat';
import UserContext from './Context/UserContext';
import './App.css';

function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) setUser(currentUser);
    else setUser();
  });

  const updateLoading = (value) => {
    setLoading(value);
  };

  const signInGuest = () => {
    // Sign In Guest Here -> account named @Guest
  };

  return (
    <div className='App'>
      <UserContext.Provider value={{ user, setUser }}>
        {user && <Header />}
        <Switch>
          <Route
            exact
            path='/'
            render={() => (
              <Home
                updateLoading={updateLoading}
                loading={loading}
                signInGuest={signInGuest}
              />
            )}
          />
          <Route
            exact
            path='/register'
            render={() => (
              <Register
                updateLoading={updateLoading}
                signInGuest={signInGuest}
              />
            )}
          />
          <Route exact path='/chat'>
            {user ? <Chat /> : <Redirect to='/' />}
          </Route>
          <Route exact path='/:username'>
            {user ? <Profile /> : <Redirect to='/' />}
          </Route>
        </Switch>
      </UserContext.Provider>
    </div>
  );
}

export default App;
