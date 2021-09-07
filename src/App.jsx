import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Inbox from './components/Inbox';
import './App.css';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/inbox' component={Inbox} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
