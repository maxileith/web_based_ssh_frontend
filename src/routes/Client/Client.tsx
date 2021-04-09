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
import XTerm from "./Terminal";

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
            <Headbar />
            <Container>
                <h1>Client Nr. {match.params.id} </h1>
                <Grid
                    container
                    spacing={2}
                    alignItems="stretch"
                    direction="row"
                    justify="center"
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
                <Grid
                    container
                    justify="flex-start"
                    alignItems="stretch"
                    style={{ width: "100%", marginTop: "16px" }}
                >
                    <Grid item>
                        <XTerm />
                    </Grid>
                    {/*
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                disabled
                                InputProps={{
                                    classes: {
                                        disabled: classes.console,
                                    },
                                }}
                                rows={10}
                                rowsMax={50}
                                value={"Warte auf Antwort ..."}
                            />
                        </Grid>
                        <Box component={Grid} display={{ xs: "none", sm: "block" }}>
                            <div className={classes.prompt}>
                                <Typography style={{ padding: "4px" }}>
                                    niklas@pop-os:~$
                                </Typography>
                            </div>
                        </Box>
                        <Box
                            component={Grid}
                            display={{ xs: "block", sm: "none" }}
                            style={{ width: "100%" }}
                        >
                            <div className={classes.prompt}>
                                <Typography style={{ padding: "4px" }}>
                                    niklas@pop-os:~$
                                </Typography>
                            </div>
                        </Box>
                        <Grid item style={{ flexGrow: 1 }}>
                            <TextField
                                autoFocus
                                fullWidth
                                InputProps={{
                                    className: classes.input,
                                }}
                                placeholder="Enter Command"
                            />
                        </Grid>
                    */}
                </Grid>
            </Container>
        </Fragment>
    );
}
