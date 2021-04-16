import {
    Card,
    CardContent,
    Container,
    Grid,
    makeStyles,
    Typography,
    TextField,
    CssBaseline,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button,
    DialogActions,
    TextareaAutosize,
} from "@material-ui/core";
import React, {
    ChangeEvent,
    FormEvent,
    Fragment,
    useEffect,
    useState,
} from "react";
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
    const [userInfo, setUserInfo] = useState({
        surname: "Horst",
        name: "Günter",
        mail: "horst@günter.de",
    });
    const [inputs, setInputs] = useState({
        surname: "Horst",
        name: "Günter",
        mail: "horst@günter.de",
        oldPassword: "",
        newPassword1: "",
        newPassword2: "",
    });

    const {
        surname,
        name,
        mail,
        oldPassword,
        newPassword1,
        newPassword2,
    } = inputs;

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
            surname: userInfo.surname,
            name: userInfo.name,
            mail: userInfo.mail,
            oldPassword: "",
            newPassword1: "",
            newPassword2: "",
        });
    };

    const onSubmitChanges = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (oldPassword && newPassword1 && newPassword2) {
            if (newPassword1 !== newPassword2) {
                toast.error(
                    "Das neue PAsswort wurde nicht korrekt wiederholt!"
                );
            } else {
                // API call für Passwort-Änderung
            }
        } else if (oldPassword || newPassword1 || newPassword2) {
            toast.warning(
                "Wenn sie ihr Passwort ändern wollen, müssen sie alle Felder ausfüllen!"
            );
        } else if (
            surname !== userInfo.surname ||
            name !== userInfo.name ||
            mail !== userInfo.mail
        ) {
            //API call für Änderungen
        } else {
            toast.warning("Es wurden keine Änderungen vorgenommen!");
        }
    };

    const onInputChanges = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        e.preventDefault();
        setInputs({ ...inputs, [e.target.name]: e.target.value });

        if (e.target.name === "newPassword2") {
            if (e.target.value !== newPassword1) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }
        } else if (e.target.name === "newPassword1") {
            if (e.target.value !== newPassword2) {
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
                                name="surname"
                                id="surname"
                                label="Vorname"
                                value={surname}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                name="name"
                                id="name"
                                label="Nachname"
                                value={name}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                name="mail"
                                id="mail"
                                label="E-Mail"
                                type="email"
                                value={mail}
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
                                name="oldPassword"
                                id="oldPassword"
                                label="Passwort"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                name="newPassword1"
                                id="newPassword1"
                                label="Neues Passwort"
                                type="password"
                                value={newPassword1}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                name="newPassword2"
                                id="newPassword2"
                                label="Neues Passwort wiederholen"
                                type="password"
                                value={newPassword2}
                                onChange={(e) => onInputChanges(e)}
                                fullWidth
                                error={passwordError}
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
