import {
    AppBar,
    Button,
    Container,
    CssBaseline,
    makeStyles,
    TextField,
    Toolbar,
    Typography,
    useScrollTrigger,
} from "@material-ui/core";
import React, { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import API from "../../Api";

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface Props {
    children: React.ReactElement;
}

// component to register as a new user
const Register = (props: any) => {
    const [inputs, setInputs] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
        repeatPassword: "",
    });

    const [disable, setDisable] = useState(false);

    const history = useHistory();
    const classes = useStyles();

    const [passwordError, setPasswordError] = useState(false);

    const {
        first_name,
        last_name,
        email,
        username,
        password,
        repeatPassword,
    } = inputs;

    const onChangeText = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
        if (e.target.name === "password" && e.target.value !== repeatPassword) {
            setPasswordError(true);
        } else if (
            e.target.name === "repeatPassword" &&
            e.target.value !== password
        ) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // disbale register button while waiting for response
        setDisable(true);

        const body = { first_name, last_name, email, password, username };

        if (passwordError) {
            toast.error("The passwords do not match.");
            return;
        }

        API.post("auth/register/", body)
            .then((res) => {
                if (res.data && res.data.message) {
                    toast.success(res.data.message);
                }
                history.push("/login");
            })
            .catch((err) => {
                setDisable(false);
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.message);
                    console.error(err.message);
                }
            });
    };

    // custom headbar with no burgermenu
    function ElevationScroll(props: Props) {
        const { children } = props;
        const trigger = useScrollTrigger({
            disableHysteresis: true,
            threshold: 0,
        });

        return React.cloneElement(children, {
            elevation: trigger ? 4 : 0,
        });
    }

    return (
        <>
            <CssBaseline />
            <ElevationScroll>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6">
                            Web Based SSH Client
                        </Typography>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar style={{ marginBottom: "16px" }} />
            <Container>
                <Fragment>
                    <h1>Register</h1>
                    <form onSubmit={onSubmitForm}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="first_name"
                            label="Forename"
                            name="first_name"
                            value={first_name}
                            onChange={(e) => onChangeText(e)}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="last_name"
                            label="Surname"
                            name="last_name"
                            value={last_name}
                            onChange={(e) => onChangeText(e)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-Mail"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => onChangeText(e)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={username}
                            onChange={(e) => onChangeText(e)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => onChangeText(e)}
                            error={passwordError}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="repeatPassword"
                            label="Repeat Password"
                            type="password"
                            id="repeatPassword"
                            autoComplete="current-password"
                            value={repeatPassword}
                            onChange={(e) => onChangeText(e)}
                            error={passwordError}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={disable}
                        >
                            Register
                        </Button>
                    </form>
                </Fragment>
            </Container>
        </>
    );
};

export default Register;
