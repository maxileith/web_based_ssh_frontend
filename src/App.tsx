import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";
import Login from "./routes/Login/Login";
import Dashboard from "./routes/Dashboard/Dashboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./routes/Register/Register";
import API from "./Api";
import Verify from "./routes/Verify/Verify";
import User from "./routes/User/User";
import ClientWrapper from "./routes/Client/Clientwrapper";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#5e81ac",
        },
        secondary: {
            main: "#bf616a",
        },
    },
});

toast.configure({
    position: toast.POSITION.TOP_CENTER,
});

// the "main" function handling the Authentication
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const setAuth = (bool: boolean) => {
        setIsAuthenticated(bool);
    };

    // always starts with a verify of user and the routes based on that
    useEffect(() => {
        API.get("auth/verify/")
            .then((res) => {
                setIsAuthenticated(res.data.success);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response) {
                    if (
                        err.response.status === 403 ||
                        err.response.status === 401
                    ) {
                        setIsAuthenticated(false);
                    }
                }
                setLoading(false);
            });
    }, []);

    // while loading return loadingindicator, otherwise return Router to handle navigation
    // always checking for authentication if necessary and redirection based on status
    if (!loading) {
        return (
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={(props) =>
                                isAuthenticated ? (
                                    <Dashboard {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/login"
                            render={(props) =>
                                !isAuthenticated ? (
                                    <Login {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/register"
                            render={(props) =>
                                !isAuthenticated ? (
                                    <Register {...props} />
                                ) : (
                                    <Redirect to="/" />
                                )
                            }
                        />
                        <Route
                            path="/client/:id"
                            render={(props) =>
                                isAuthenticated ? (
                                    <ClientWrapper
                                        {...props}
                                        setAuth={setAuth}
                                    />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/verify/:token"
                            render={(props) =>
                                !isAuthenticated ? (
                                    <Verify {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/" />
                                )
                            }
                        />
                        <Route
                            path="/user"
                            render={(props) =>
                                isAuthenticated ? (
                                    <User {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                    </Switch>
                </Router>
            </ThemeProvider>
        );
    } else {
        return <LoadingIndicator />;
    }
}

export default App;
