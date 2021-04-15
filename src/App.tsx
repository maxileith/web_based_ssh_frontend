import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import Login from './routes/Login/Login';
import Dashboard from './routes/Dashboard/Dashboard';
import Client from './routes/Client/Client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './routes/Register/Register';
import API from './Api';
import Verify from './routes/Verify/Verify';
import User from './routes/User/User';

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setAuth = (bool: boolean) => {
    setIsAuthenticated(bool);
  }

  useEffect(() => {
    if(localStorage.token) {
      API.get('auth/verify')
        .then((res) => {
          setIsAuthenticated(res.data.success);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err.message);
          setLoading(false);
        })
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [])

  if (!loading) {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" render={props => isAuthenticated ? <Dashboard {...props} setAuth={setAuth} /> : <Redirect to="/login" /> } />
            <Route exact path="/login" render={props => !isAuthenticated ? <Login {...props} setAuth={setAuth} /> : <Redirect to="/" /> } />
            <Route exact path="/register" render={props => !isAuthenticated ? <Register {...props} setAuth={setAuth} /> : <Redirect to="/" /> } /> 
            <Route path="/client/:id" render={props => isAuthenticated ? <Client {...props} setAuth={setAuth} /> : <Redirect to="/login" />} />
            <Route path="/verify/:token" render={props => !isAuthenticated ? <Verify {...props} setAuth={setAuth} /> : <Redirect to="/" />} />
            <Route path="/user" render={props => isAuthenticated ? <User {...props} setAuth={setAuth} /> : <Redirect to="/login" /> } />
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
