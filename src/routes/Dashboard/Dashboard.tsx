import { Container, Grid, IconButton, Typography } from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import Headbar from "../../components/Headbar/Headbar";
import SessionCard from "../../components/SessionCard/SessionCard";
import AddSession from "../../components/AddSession/AddSession";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import API from "../../Api";
import { ISessionInfo } from "../../components/SessionCard/SessionCard";
import { toast } from "react-toastify";

interface IDashboard {
    setAuth(bool: boolean): void;
}

export default function Dashboard(props: IDashboard) {
    const [edit, setEdit] = useState(false);
    const [savedSessions, setSavedSessions] = useState<any>({
        sessions: [],
    });
    const [deleteable, setDeleteable] = useState(false);

    const toggleEdit = () => {
        setEdit(!edit);
        setDeleteable(false);
    };

    const toggleDeleteable = () => {
        setDeleteable(!deleteable);
        setEdit(false);
    };

    const addSession = (session: ISessionInfo) => {
        let newSavedSessions = savedSessions.sessions;
        newSavedSessions.push(session);
        setSavedSessions({ sessions: newSavedSessions });
    };

    const updateSession = (index: number, session: ISessionInfo) => {
        let updatedSavedSessions = savedSessions.sessions;
        updatedSavedSessions[index] = session;
        console.log(updatedSavedSessions);
        setSavedSessions({ sessions: updatedSavedSessions });
    };

    const deleteSession = (index: number) => {
        let updatedSavedSessions = savedSessions.sessions;
        updatedSavedSessions.splice(index, 1);
        console.log(updatedSavedSessions);
        setSavedSessions({ sessions: updatedSavedSessions });
    };

    useEffect(() => {
        API.get("saved_sessions/", { withCredentials: true })
            .then((data) => {
                setSavedSessions({ sessions: data.data["sessions"] });
                localStorage.setItem("sessions", JSON.stringify(data.data["sessions"]));
                console.log(data.data["sessions"]);
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.message);
                }
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
                            Saved Sessions
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={toggleEdit}>
                            <CreateIcon color={edit ? "primary" : "inherit"} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={toggleDeleteable}>
                            <DeleteIcon
                                color={deleteable ? "secondary" : "inherit"}
                            />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    alignItems="stretch"
                    direction="row"
                    justify="flex-start"
                >
                    {savedSessions.sessions.map(
                        (session: ISessionInfo, index: number) => (
                            <SessionCard
                                session={session}
                                edit={edit}
                                deleteable={deleteable}
                                update={(session) =>
                                    updateSession(index, session)
                                }
                                delete={() => deleteSession(index)}
                            />
                        )
                    )}
                </Grid>
                <AddSession addSession={addSession} />
            </Container>
        </Fragment>
    );
}
