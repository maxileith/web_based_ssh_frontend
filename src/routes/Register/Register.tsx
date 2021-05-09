import { AppBar, Button, Container, CssBaseline, makeStyles, TextField, Toolbar, Typography, useScrollTrigger } from "@material-ui/core";
import React, { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import API from "../../Api";

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface IRegister {
    setAuth(bool: boolean): void;
}

interface Props {
    children: React.ReactElement;
}

const Register = ({ setAuth }: IRegister) => {
    const [inputs, setInputs] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
    });

    const [disable, setDisable] = useState(false);

    const history = useHistory();
    const classes = useStyles();

    const { first_name, last_name, email, username, password } = inputs;

    const onChangeText = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisable(true);

        const body = { first_name, last_name, email, password, username };

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
