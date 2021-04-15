import {
    Container,
    Grid,
    IconButton,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import Headbar from "../../components/Headbar/Headbar";
import SessionCard from "../../components/SessionCard/SessionCard";
import AddSession from "../../components/AddSession/AddSession";
import CreateIcon from "@material-ui/icons/Create";
import API from "../../Api";
import { ISessionInfo } from "../../components/SessionCard/SessionCard";

interface IDashboard {
    setAuth(bool: boolean): void;
}

export default function Dashboard(props: IDashboard) {
    const [edit, setEdit] = useState(false);
    const [savedSessions, setSavedSessions] = useState([]);

    const toggleEdit = () => {
        setEdit(!edit);
    };

    useEffect(() => {
        API.get("saved_sessions/", { withCredentials: true })
            .then((data) => {
                setSavedSessions(data.data["sessions"]);
            })
            .catch((err) => {
                console.error(err.message);
            });
    }, []);

    return (
        <Fragment>
            <Headbar setAuth={props.setAuth} />
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item>
                        <Typography variant="h3" component="h1">
                            Liste aller ihrer Server
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={toggleEdit}>
                            <CreateIcon
                                color={edit ? "secondary" : "inherit"}
                            />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    alignItems="stretch"
                    direction="row"
                    justify="center"
                >
                    {/*savedSessions.map((server: IServerInfo) => (
                        <Grid item xs={12} sm={6} md={4} key={server.id}>
                            <Card className={classes.fullHeight}>
                                <CardActionArea
                                    className={classes.fullHeight}
                                    onClick={() =>
                                        history.push(`/client/${server.id}`)
                                    }
                                >
                                    <CardContent className={classes.fullHeight}>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                        >
                                            {server.title}
                                        </Typography>
                                        <Typography gutterBottom>
                                            Hostname: {server.hostname}, User:{" "}
                                            {server.username}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            {server.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                    {[...new Array(5)].map((now, index) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card className={classes.fullHeight}>
                                    <CardActionArea
                                        className={classes.fullHeight}
                                        onClick={() =>
                                            history.push(`/client/${index}`)
                                        }
                                    >
                                        <CardContent
                                            className={classes.fullHeight}
                                        >
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="h2"
                                            >
                                                Servername
                                            </Typography>
                                            <Typography gutterBottom>
                                                Hostname:
                                                traefik.webssh.leith.de, User:
                                                root
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                component="p"
                                            >
                                                Eine fancy Beschreibung, was auf
                                                deinem super geilem Server grade
                                                läuft
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                    <Grid item xs={12} sm={6} md={4} key={123}>
                        <Card>
                            <CardActionArea
                                onClick={() => history.push(`/client/234`)}
                            >
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                    >
                                        Servername
                                    </Typography>
                                    <Typography gutterBottom>
                                        Hostname: 8.8.8.8, User: root
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        Eine fancy Beschreibung, was auf deinem
                                        super geilem Server grade läuft Eine
                                        fancy Beschreibung, was auf deinem super
                                        geilem Server grade läuft Eine fancy
                                        Beschreibung, was auf deinem super
                                        geilem Server grade läuft Eine fancy
                                        Beschreibung, was auf deinem super
                                        geilem Server grade läuft Eine fancy
                                        Beschreibung, was auf deinem super
                                        geilem Server grade läuft Eine fancy
                                        Beschreibung, was auf deinem super
                                        geilem Server grade läuft
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    */}
                    {savedSessions.map((session: ISessionInfo) => (
                        <SessionCard session={session} edit={edit} />
                    ))}
                </Grid>
                <AddSession />
            </Container>
        </Fragment>
    );
}
