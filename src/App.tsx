import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, matchPath } from "react-router-dom";
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import Login from './routes/Login/Login';
import Dashboard from './routes/Dashboard/Dashboard';
import Client from './routes/Client/Client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red,
  },
})

toast.configure({
  position: toast.POSITION.TOP_CENTER,
});

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  const setAuth = (bool: boolean) => {
    setIsAuthenticated(bool);
  }

  if (!loading) {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" render={props => isAuthenticated ? <Dashboard {...props} setAuth={setAuth} /> : <Redirect to="/login" /> } />
            <Route exact path="/login" render={props => !isAuthenticated ? <Login {...props} setAuth={setAuth} /> : <Redirect to="/" /> } />
            <Route path="/client/:id" render={props => isAuthenticated ? <Client {...props} setAuth={setAuth} /> : <Redirect to="/login" />} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  } else {
    return (
      <LoadingIndicator />
    )
  }
}

export default App;
