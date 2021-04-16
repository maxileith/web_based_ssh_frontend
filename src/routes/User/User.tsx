import {
    Container,
    Grid,
    makeStyles,
    Typography,
    TextField,
    Button,
    TextareaAutosize,
    Checkbox,
    FormControlLabel,
} from "@material-ui/core";
import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
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
        color: "white",
        fontFamily: "Ubuntu Mono, monospace",
        "&:focus": {
            outline: 0,
        },
    },
    button: {
        width: "96px",
    },
}));

interface ISetAuth {
    setAuth(bool: boolean): void;
}

export default function Client({ setAuth }: ISetAuth) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
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
    }

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
        console.log(e);
        const body = {
            content: sshInput,
        };
        API.put("/known_hosts/", body, { withCredentials: true })
            .then(() => {
                toast.success("Saved known hosts.");
                setSshKeys(sshInput);
            })
            .catch((err) => {
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
        let updates = {};
        if (first_name !== userInfo.first_name) {
            updates = { first_name: first_name };
        }
        if (last_name !== userInfo.last_name) {
            updates = { ...updates, last_name: last_name }
        }
        if (email !== userInfo.email) {
            updates = { ...updates, email: email };
        }
        if (changePassword) {
            if(password === password2) {
                updates = {
                    ...updates,
                    old_password: old_password,
                    password: password
                };
            }
        }
        if (Object.keys(updates).length > 0) {
            API.patch('/personal_data/', updates)
                .then((res) => {
                    toast.success('Updated personal data successfully!')
                })
                .catch((err) => {
                    console.error(err.message);
                    toast.error("Changes could not be saved!");
                })
        } else {
            toast.warning("There are no changes to save!")
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

    useEffect(() => {
        API.get("/known_hosts/", { withCredentials: true })
            .then((data) => {
                setSshKeys(data.data["content"]);
                setSshInput(data.data["content"]);
            })
            .catch((err) => {
                console.log(err.message);
                toast.error("Failed to load known hosts.");
            });
        API.get("/personal_data/", { withCredentials: true })
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
                    Persönliche Daten
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
                                label="Vorname"
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
                                label="Nachname"
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
                                Um ihr Passwort zu ändern, gaben sie bitte ihr
                                Passwort ein, suche sie sich ein Neues aus und
                                wiederholen sie es.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="old_password"
                                id="old_password"
                                label="Passwort"
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
                                label="Neues Passwort"
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
                                label="Neues Passwort wiederholen"
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
                    <TextareaAutosize
                        rowsMin={20}
                        rowsMax={20}
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
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Fragment>
    );
}
