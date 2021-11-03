import { useState } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header/Header';
import Home from './components/Home';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat';
import AddPost from './components/AddPost/AddPost';
import ModalView from './ViewPost/ModalView/ModalView';
import SoloView from './ViewPost/SoloView/SoloView';
import UserContext from './Context/UserContext';
import './App.css';

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  console.log(background);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(
    JSON.parse(localStorage.getItem('userWillSignIn') || false)
  );

  const [showAddModal, setShowAddModal] = useState(false);

  const auth = getAuth();

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      if (!localStorage.getItem('userWillSignIn'))
        localStorage.setItem('userWillSignIn', 'true');
      setLoading(false);
    } else {
      setUser();
      localStorage.removeItem('userWillSignIn');
    }
  });

  const updateLoading = (value) => {
    setLoading(value);
  };

  const updateAddModal = (value) => {
    setShowAddModal(value);
  };

  const signInGuest = () => {
    // Sign In Guest Here -> account named @Guest
  };

  return (
    <div className='App'>
      <UserContext.Provider value={{ user, setUser }}>
        {user && (
          <Header updateAddModal={updateAddModal} showAddModal={showAddModal} />
        )}
        {showAddModal && <AddPost updateAddModal={updateAddModal} />}
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
          <Route path='/:username/:id'>
            <SoloView />
          </Route>
          <Route path='/:username'>
            {user || localStorage.getItem('userWillSignIn') ? (
              <Profile />
            ) : (
              <Redirect to='/' />
            )}
          </Route>
        </Switch>
        {background && (
          <Route path='/:username/:id'>
            <ModalView />
          </Route>
        )}
      </UserContext.Provider>
    </div>
  );
}

export default App;
