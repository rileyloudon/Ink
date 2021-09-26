import { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from './components/Home';
import Register from './components/Register/Register';
import Chat from './components/Chat';
import Header from './components/Header/Header';
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
    // 'Sign in as guest' -> account named @Guest
    // Sign In Guest Here
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
          <Route exact path='/chat' render={() => <Chat />} />
          {/* <Route exact path='/:username' /> */}
        </Switch>
      </UserContext.Provider>
    </div>
  );
}

export default App;
