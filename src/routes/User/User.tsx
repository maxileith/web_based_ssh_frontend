import {
    Container,
    Grid,
    makeStyles,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
} from "@material-ui/core";
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Headbar from "../../components/Headbar/Headbar";
import API from "../../Api";

const useStyles = makeStyles((theme) => ({
    console: {
        background: "black",
        color: "white",
    },
    input: {
        background: "black",
        color: "white",
    },
    prompt: {
        background: "black",
        color: theme.palette.primary.main,
        height: "100%",
        width: "100%",
    },
    editor: {
        width: "100%",
        background: "black",
        marginBottom: "1rem",
    },
    multilineColor: {
        color: "white",
        fontFamily: "Ubuntu Mono, monospace",
    },
    button: {
        width: "96px",
    },
    delete: {
        marginTop: "32px",
    },
}));

interface ISetAuth {
    setAuth(bool: boolean): void;
}

export default function Client({ setAuth }: ISetAuth) {
    const classes = useStyles();
    // const [loading, setLoading] = useState(true);
    const [sshKeys, setSshKeys] = useState("");
    const [sshInput, setSshInput] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [userInfo, setUserInfo] = useState({
        last_name: "",
        first_name: "",
        email: "",
    });
    const [inputs, setInputs] = useState({
        ...userInfo,
        old_password: "",
        password: "",
        password2: "",
    });
    const [disable, setDisable] = useState(false);

    const {
        last_name,
        first_name,
        email,
        old_password,
        password,
        password2,
    } = inputs;

    const handlePasswordChange = () => {
        setChangePassword(!changePassword);
    };

    const onSshChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSshInput(e.target.value);
    };

    const resetSshKeys = () => {
        setSshInput(sshKeys);
    };

    const onSshSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisable(true)
        console.log(e);
        const body = {
            content: sshInput,
        };
        API.put("/known_hosts/", body, { withCredentials: true })
            .then(() => {
                toast.success("Saved known hosts.");
                setSshKeys(sshInput);
                setDisable(false);
            })
            .catch((err) => {
                setDisable(false);
                console.log(err.message);
                toast.error("Failed to save known hosts.");
            });

        // API call für Änderungen des Key-Files
    };

    const resetInputs = () => {
        setInputs({
            last_name: userInfo.last_name,
            first_name: userInfo.first_name,
            email: userInfo.email,
            old_password: "",
            password: "",
            password2: "",
        });
    };

    const onSubmitChanges = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisable(true);
        let updates = {};
        if (first_name !== userInfo.first_name) {
            updates = { first_name: first_name };
        }
        if (last_name !== userInfo.last_name) {
            updates = { ...updates, last_name: last_name };
        }
        if (email !== userInfo.email) {
            updates = { ...updates, email: email };
        }
        if (changePassword) {
            if (password === password2) {
                updates = {
                    ...updates,
                    old_password: old_password,
                    password: password,
                };
            }
        }
        if (Object.keys(updates).length > 0) {
            API.patch("/personal_data/", updates)
                .then((res) => {
                    setDisable(false);
                    toast.success("Updated personal data successfully!");
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
        } else {
            setDisable(false);
            toast.warning("There are no changes to save!");
        }
    };

    const onInputChanges = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        e.preventDefault();
        setInputs({ ...inputs, [e.target.name]: e.target.value });

        if (e.target.name === "password2") {
            if (e.target.value !== password) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }
        } else if (e.target.name === "password") {
            if (e.target.value !== password2) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }
        }
    };

    const deleteAccount = () => {
        setDisable(true);
        API.delete("/personal_data")
            .then((res) => {
                setDisable(false);
                toast.success(res.data.message);
                localStorage.removeItem("token");
                setAuth(false);
            })
            .catch((err) => {
                setDisable(false);
                if(err.response && err.response.data) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.message);
                    console.error(err.message);
                }
            })
    }

    useEffect(() => {
        API.get("/known_hosts/")
            .then((data) => {
                setSshKeys(data.data["content"]);
                setSshInput(data.data["content"]);
            })
            .catch((err) => {
                console.log(err.message);
                toast.error("Failed to load known hosts.");
            });
        API.get("/personal_data/")
            .then((data) => {
                setUserInfo(data.data);
                setInputs(data.data);
            })
            .catch((err) => {
                console.log(err.message);
                toast.error("Failed to load personal details.");
            });
    }, []);

    return (
        <Fragment>
            <Headbar setAuth={setAuth} />
            <Container>
                <Typography variant="h4" component="h1" gutterBottom>
                    Personal Data
                </Typography>
                <form onSubmit={(e) => onSubmitChanges(e)}>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="flex-start"
                        spacing={2}
                    >
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                name="first_name"
                                id="first_name"
                                label="Forename"
                                value={first_name}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                name="last_name"
                                id="last_name"
                                label="Surname"
                                value={last_name}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="email"
                                id="email"
                                label="E-Mail"
                                type="email"
                                value={email}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                To change your password, please enter your
                                current password, choose a new one and repeat
                                it.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="old_password"
                                id="old_password"
                                label="Current Password"
                                type="password"
                                value={old_password}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                name="password"
                                id="password"
                                label="New Password"
                                type="password"
                                value={password}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                name="password2"
                                id="password2"
                                label="Repeat new Password"
                                type="password"
                                value={password2}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                                error={passwordError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={changePassword}
                                        onChange={handlePasswordChange}
                                        color="primary"
                                    />
                                }
                                label="I want to change my password"
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item>
                            <Button
                                variant="contained"
                                color="default"
                                className={classes.button}
                                onClick={resetInputs}
                            >
                                Reset
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                type="submit"
                                disabled={disable}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Typography variant="h5" gutterBottom>
                    Known hosts:
                </Typography>
                <form onSubmit={(e) => onSshSubmit(e)}>
                    <TextField
                        multiline
                        rows={20}
                        rowsMax={20}
                        InputProps={{
                            className: classes.multilineColor
                        }}
                        className={classes.editor}
                        spellCheck={false}
                        value={sshInput}
                        onChange={(e) => onSshChange(e)}
                        
                    />
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="flex-end"
                        spacing={2}
                    >
                        <Grid item>
                            <Button
                                variant="contained"
                                color="default"
                                className={classes.button}
                                onClick={resetSshKeys}
                            >
                                Reset
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                type="submit"
                                disabled={disable}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Button fullWidth color="secondary" variant="contained" className={classes.delete} onClick={deleteAccount} disabled={disable}>
                    Account Löschen
                </Button>
            </Container>
        </Fragment>
    );
}
