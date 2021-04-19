import {
    Card,
    CardContent,
    Container,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router";
import Headbar from "../../components/Headbar/Headbar";
import Term from "../../components/Terminal/Term";
import { ISessionInfo } from "../../components/SessionCard/SessionCard";
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
}));

interface IClient {
    setAuth(bool: boolean): void;
}

interface IMatchParams {
    id: string;
}

export default function Client({ match }: any, props: IClient) {
    const history = useHistory();
    const [session, setSession] = useState({} as ISessionInfo);

    const sessionId = match.params.id;
    useEffect(() => {
        API.get("saved_sessions/details/" + sessionId, {
            withCredentials: true,
        })
            .then((data) => {
                setSession(data.data.details);
            })
            .catch((err) => {
                console.error(err.message);
            });
    }, []);

    /*
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [inputs, setInputs] = useState({
        note: "",
        servername: "",
    });

    const [informations, setInformations] = useState({
        host: "",
        user: "",
        provider: "",
        note: "",
        servername: "",
    });

    const { note, servername } = inputs;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs({ ...inputs, [e.target.id]: e.target.value });
    };

    const refreshModal = () => {
        setInputs({
            ...inputs,
            servername: informations.servername,
            note: informations.note,
        });
        setOpen(false);
    };
    
    const updateServerInformations = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let newInformations = {};
        if (servername !== informations.servername) {
            newInformations = { servername: servername };
        }
        if (note !== informations.note) {
            newInformations = { ...newInformations, note: note };
        }
        if (Object.keys(newInformations).length > 0) {
            console.log(newInformations);

            // Add api-call to update informations
        } else {
            console.log("no updates");
        }
        setOpen(false);
    };
    */

    return (
        <Fragment>
            <Headbar setAuth={props.setAuth} />
            <Container>
                {/*
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h4">
                            Client Nr. {match.params.id}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={handleClickOpen}>
                            <CreateIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                */}
                <Grid
                    container
                    spacing={2}
                    alignItems="stretch"
                    direction="row"
                    justify="center"
                    style={{ marginBottom: "16px" }}
                >
                    <Grid item xs={12} sm={6}>
                        <Card style={{ height: "100%" }}>
                            <CardContent>
                                <Typography>
                                    <b>Hostname:</b> {session.hostname}
                                    <br />
                                    <b>Username:</b> {session.username}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card style={{ height: "100%" }}>
                            <CardContent>
                                <Typography>
                                    <b>Client-ID:</b> {session.id} <br />
                                    <b>Verbunden seit:</b> 12:00
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Term history={history} sessionId={sessionId} />

                {/*
                    <Dialog open={open} onClose={handleClose}>
                        <form onSubmit={(e) => updateServerInformations(e)}>
                            <DialogTitle>Informationen Bearbeiten</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Geben Sie ihrem Server einen Namen, um ihn
                                    besser zu identifizieren!
                                </DialogContentText>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    spacing={2}
                                >
                                    <Grid item xs={12}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="servername"
                                            label="Servername"
                                            type="text"
                                            onChange={(e) => onChange(e)}
                                            value={servername}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogTitle>Details</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Weitere Details zum Server
                                </DialogContentText>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    spacing={2}
                                >
                                    <Grid item xs={12}>
                                        <TextField
                                            margin="dense"
                                            id="note"
                                            label="Notize"
                                            type="text"
                                            onChange={(e) => onChange(e)}
                                            value={note}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={refreshModal} color="primary">
                                    Cancel
                                </Button>
                                <Button type="submit" color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                */}
            </Container>
        </Fragment>
    );
}
