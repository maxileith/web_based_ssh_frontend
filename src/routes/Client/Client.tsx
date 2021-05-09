import {
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router";
import Term from "../../components/Terminal/Term";
import { ISessionInfo } from "../../components/SessionCard/SessionCard";
import API from "../../Api";

interface IClient {
    id: number;
    clientCount: number;
    selfDestroy: (index: number) => void;
    index: number;
}

// displays a Client and its information in the clientwrapper
export default function Client(props: IClient) {
    const history = useHistory();
    const [session, setSession] = useState({} as ISessionInfo);
    const date = new Date();
    const startTime = date.getTime();
    const [connectionTime, setConnectionTime] = useState("00:00:00");

    const sessionId = props.id;
    // get session details for session id
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

        updateTime();
    }, []);

    // connection timer
    const updateTime = () => {
        const newDate = new Date();
        let upTime = newDate.getTime() - startTime;
        const upHours = Math.floor(upTime / 3600000);
        upTime = upTime % 3600000;
        const upMinutes = Math.floor(upTime / 60000);
        upTime = upTime % 60000;
        const upSeconds = Math.floor(upTime / 1000);

        setConnectionTime(
            formatTime(upHours) +
                ":" +
                formatTime(upMinutes) +
                ":" +
                formatTime(upSeconds)
        );

        setTimeout(updateTime, 1000);
    };

    const formatTime = (i: number) => {
        return i < 10 ? "0" + i : "" + i;
    };

    return (
        <Fragment>
            <Container>
                <Typography variant="h3" component="h1" gutterBottom>
                    {session.title}
                </Typography>
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
                                    <b>Authentication-Method:</b>{" "}
                                    {session.key_file ? "Key file" : "Password"}{" "}
                                    <br />
                                    <b>Connected for:</b> {connectionTime}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Term
                    history={history}
                    sessionId={sessionId}
                    clientCount={props.clientCount}
                    selfDestroy={props.selfDestroy}
                    index={props.index}
                />
            </Container>
        </Fragment>
    );
}
