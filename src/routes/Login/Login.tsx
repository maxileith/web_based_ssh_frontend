import {
    Avatar,
    Button,
    CssBaseline,
    Grid,
    Link,
    makeStyles,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import { ChangeEvent, FormEvent, useState } from "react";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import API from "../../Api";
import { toast } from "react-toastify";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
    },
    image: {
        backgroundImage: "url(https://source.unsplash.com/random)",
        backgroundRepeat: "no-repeat",
        backgroundColor:
            theme.palette.type === "light"
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface ISetAuth {
    setAuth(bool: boolean): void;
}

// login screen with picture
export default function Login({ setAuth }: ISetAuth) {
    const classes = useStyles();
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [disable, setDisable] = useState(false);

    const { username, password } = inputs;

    const history = useHistory();

    const onChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    // disable login button while waiting for response
    const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisable(true);

        const body = { username, password };

        API.post("auth/login/", body)
            .then((data) => {
                localStorage.setItem("token", data.data["token"]);
                setAuth(true);
            })
            .catch((err) => {
                setDisable(false);
                if (err.response && err.response.status === 401) {
                    toast.error("Username or password wrong");
                } else {
                    toast.error(err.message);
                    console.error(err.message);
                }
            });
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Web Based SSH Log In
                    </Typography>
                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={(e) => onSubmitForm(e)}
                    >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            onChange={(e) => onChange(e)}
                            value={username}
                            //autoFocus
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
                            onChange={(e) => onChange(e)}
                            value={password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={disable}
                        >
                            Sign In
                        </Button>
                    </form>
                    <Link
                        onClick={() => history.push("/register")}
                        style={{ cursor: "pointer" }}
                    >
                        Register
                    </Link>
                </div>
            </Grid>
        </Grid>
    );
}
