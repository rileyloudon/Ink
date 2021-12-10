import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header/Header';
import Home from './components/Home';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat';
import AddPost from './components/AddPost/AddPost';
import HorizontalPost from './components/Post/HorizontalPost/HorizontalPost';
import LikedFeed from './components/LikedFeed/LikedFeed';
import UserContext from './Context/UserContext';
import './App.css';

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(
    JSON.parse(localStorage.getItem('userWillSignIn') || false)
  );

  const [showAddModal, setShowAddModal] = useState(false);

  const updateLoading = (value) => setLoading(value);
  const updateAddModal = (value) => setShowAddModal(value);
  const signInGuest = () => {
    // Sign In Guest -> account named @Guest
  };

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (!localStorage.getItem('userWillSignIn'))
          localStorage.setItem('userWillSignIn', 'true');
        setLoading(false);
      } else {
        setUser();
        localStorage.removeItem('userWillSignIn');
      }

      return () => unsub;
    });
  }, []);

  return (
    <div className='App'>
      <UserContext.Provider value={{ user, setUser }}>
        {user && (
          <Header updateAddModal={updateAddModal} showAddModal={showAddModal} />
        )}
        {showAddModal && <AddPost updateAddModal={updateAddModal} />}
        <Switch location={background || location}>
          <Route path='/:username/liked'>
            {user || localStorage.getItem('userWillSignIn') ? (
              <LikedFeed />
            ) : (
              <Redirect to='/' />
            )}
          </Route>
          <Route exact path='/:username/:postId'>
            {user || localStorage.getItem('userWillSignIn') ? (
              <HorizontalPost />
            ) : (
              <Redirect to='/' />
            )}
          </Route>
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
            <Route exact path='/settings'>
              {/* {user ? <Settings /> : <Redirect to='/' />} */}
            </Route>
            <Route exact path='/chat'>
              {user || localStorage.getItem('userWillSignIn') ? (
                <Chat />
              ) : (
                <Redirect to='/' />
              )}
            </Route>
            <Route path='/:username'>
              {user || localStorage.getItem('userWillSignIn') ? (
                <Profile />
              ) : (
                <Redirect to='/' />
              )}
            </Route>
          </Switch>
        </Switch>
        {background && (
          <Route path='/:username/:postId'>
            <HorizontalPost modal />
          </Route>
        )}
      </UserContext.Provider>
    </div>
  );
}

export default App;
