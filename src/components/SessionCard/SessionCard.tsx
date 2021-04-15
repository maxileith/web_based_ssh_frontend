import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";
import DeleteIcon from "@material-ui/icons/Delete";
import API from "../../Api";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight: {
        height: "100%",
    },
    deleteCard: {
        "&:hover": {
            border: "2px solid red",
            margin: "-2px",
        },
    },
}));

export interface ISessionInfo {
    id: number;
    title: String;
    hostname: String;
    username: String;
    description: String;
}

interface ISessionCard {
    session: ISessionInfo;
    edit: boolean;
}

const SessionCard = (props: ISessionCard) => {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);

    const removeSession = (sessionId: number) => {
        API.delete("saved_sessions/details/" + sessionId, {
            withCredentials: true,
        })
            .then(() => {
                toast.success("Session removed.");
                history.go(0);
            })
            .catch((err) => {
                toast.error("An error ocurred while deleting the session.");
                setOpen(false);
                console.error(err.message);
            });
    };

    return (
        <Grid item xs={12} sm={6} md={4} key={props.session.id}>
            <Card
                className={props.edit ? classes.deleteCard : classes.fullHeight}
            >
                <CardActionArea
                    className={classes.fullHeight}
                    onClick={
                        props.edit
                            ? () => setOpen(true)
                            : () => history.push(`/client/${props.session.id}`)
                    }
                >
                    <CardContent className={classes.fullHeight}>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="h2"
                                >
                                    {props.session.title}
                                </Typography>
                            </Grid>
                            {props.edit ? (
                                <Grid item>
                                    <DeleteIcon color="secondary" />
                                </Grid>
                            ) : (
                                <></>
                            )}
                        </Grid>
                        <Typography gutterBottom>
                            Hostname: {props.session.hostname}, User:{" "}
                            {props.session.username}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            {props.session.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Server entfernen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sind Sie sich sicher, dass sie den Server '
                        {props.session.hostname}' löschen wollen? Es werden alle
                        Daten bezüglich der Verbindung gelöscht!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpen(false)}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => removeSession(props.session.id)}
                    >
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default SessionCard;
