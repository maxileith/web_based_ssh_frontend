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
import { useState } from "react";
import { useHistory } from "react-router";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import API from "../../Api";
import { toast } from "react-toastify";
import ConfigSessionModal from "./ConfigSessionModal";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight: {
        height: "100%",
    },
    deleteCard: {
        "&:hover": {
            border: "2px solid #bf616a",
            margin: "-2px",
        },
        height: "100%",
    },
    editCard: {
        "&:hover": {
            border: "2px solid #5e81ac",
            margin: "-2px",
        },
        height: "100%",
    },
}));

export interface ISessionInfo {
    id: number;
    title: String;
    hostname: String;
    username: String;
    description: String;
    port: number;
}

interface ISessionCard {
    session: ISessionInfo;
    edit: boolean;
    deleteable: boolean;
    update: (session: ISessionInfo) => void;
    delete: () => void;
}


// Sessioncards displayed in dashboard. Containing the delete and config modals
const SessionCard = (props: ISessionCard) => {
    const classes = useStyles();
    const history = useHistory();
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [disable, setDisable] = useState(false);

    const ChangeOpenEdit = (bool: boolean) => {
        setOpenEdit(bool);
    };

    // removes session from database
    const removeSession = (sessionId: number) => {
        setDisable(true);
        API.delete("saved_sessions/details/" + sessionId, {
            withCredentials: true,
        })
            .then((res) => {
                toast.success(res.data.message);
                // removes session from dashboard with no refresh
                props.delete();
                setOpenDelete(false);
            })
            .catch((err) => {
                setDisable(false);
                if (err.response && err.response.data) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.message);
                    console.error(err.message);
                }
                setOpenDelete(false);
            });
    };

    // determine style, Icon and OnClick based on selected mode in dashboard (normal, edit, delete)
    const determineStyle = () => {
        if (props.edit) return classes.editCard;

        if (props.deleteable) return classes.deleteCard;

        return classes.fullHeight;
    };

    const determineIcon = () => {
        if (props.edit) {
            return (
                <Grid item>
                    <CreateIcon color="primary" />
                </Grid>
            );
        }
        if (props.deleteable) {
            return (
                <Grid item>
                    <DeleteIcon color="secondary" />
                </Grid>
            );
        }

        return <></>;
    };

    const determineOnClick = () => {
        if (props.edit) {
            setOpenEdit(true);
        } else if (props.deleteable) {
            setOpenDelete(true);
        } else {
            history.push(`/client/${props.session.id}`);
        }
    };

    // pathing for the config-modal to the dashboard
    const updateSession = (session: ISessionInfo) => {
        props.update(session);
    };

    return (
        <>
            <Grid item xs={12} sm={6} md={4} key={props.session.id}>
                <Card className={determineStyle()}>
                    <CardActionArea
                        className={classes.fullHeight}
                        onClick={determineOnClick}
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
                                {determineIcon()}
                            </Grid>
                            <Typography gutterBottom>
                                Hostname: {props.session.hostname}, Username:{" "}
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
                <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                    <DialogTitle>Remove Session</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove the session '
                            {props.session.title}'? This operation is
                            irreversible and deletes all data associated with
                            the session.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setOpenDelete(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => removeSession(props.session.id)}
                            disabled={disable}
                        >
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
            <ConfigSessionModal
                open={openEdit}
                setOpen={ChangeOpenEdit}
                session={props.session}
                update={updateSession}
            />
        </>
    );
};

export default SessionCard;
