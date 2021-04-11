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
} from "@material-ui/core";
import React, { Fragment, useEffect } from "react";
import { toast } from "react-toastify";
import Headbar from "../../components/Headbar/Headbar";
import Term from "./Term";

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

interface ISetAuth {
    setAuth(bool: boolean): void;
}

interface IMatchParams {
    id: string;
}

export default function Client({ match }: any, { setAuth }: ISetAuth) {
    const id = match.params.id;
    const classes = useStyles();

    useEffect(() => {
        //toast.success(id);
    }, []);

    return (
        <Fragment>
            <Headbar setAuth={setAuth} />
            <Container>
                <h1>Client Nr. {match.params.id} </h1>
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
                                    <b>Hostname:</b> traefik.webssh.leith.de{" "}
                                    <br />
                                    <b>User:</b> root
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card style={{ height: "100%" }}>
                            <CardContent>
                                <Typography>
                                    <b>Client-ID:</b> {id} <br />
                                    <b>Verbunden seit:</b> 12:00
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Term />
            </Container>
        </Fragment>
    );
}
