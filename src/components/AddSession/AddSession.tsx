import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    makeStyles,
    TextField,
    Tooltip,
} from "@material-ui/core";
import { ChangeEvent, FormEvent, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import API from "../../Api";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
    absolute: {
        margin: 0,
        top: "auto",
        right: theme.spacing(3),
        bottom: theme.spacing(2),
        left: "auto",
        position: "fixed",
    },
    dialogText: {
        marginBottom: "0px",
    },
}));

const AddSession = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [inputs, setInputs] = useState({
        hostname: "",
        username: "",
        password: "",
        description: "",
        title: "",
        port: 22,
    });

    const { hostname, username, password, description, title, port } = inputs;

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
            hostname: "",
            username: "",
            password: "",
            description: "",
            title: "",
            port: 22,
        });
        setOpen(false);
    };

    const addSession = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        API.post("saved_sessions/", inputs, { withCredentials: true })
            .then((res) => {
                toast.success("Session erfolgreich hinzugefügt");
                setOpen(false);
            })
            .catch((err) => {
                console.error(err.message);
                toast.error("Session konnten nicht hinzugeführt werden");
            });
    };

    return (
        <>
            <Tooltip title="Add">
                <Fab
                    color="primary"
                    component={IconButton}
                    className={classes.absolute}
                    onClick={handleClickOpen}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <form onSubmit={(e) => addSession(e)}>
                    <DialogTitle id="form-dialog-title">
                        Server hinzufügen
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogText}>
                            Cooler Text über Server und Zeug
                        </DialogContentText>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                            spacing={2}
                        >
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="hostname"
                                    label="Hostname"
                                    type="text"
                                    onChange={(e) => onChange(e)}
                                    value={hostname}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    id="port"
                                    label="Port"
                                    type="number"
                                    onChange={(e) => onChange(e)}
                                    value={port}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    id="username"
                                    label="Username"
                                    type="text"
                                    onChange={(e) => onChange(e)}
                                    value={username}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    id="password"
                                    label="Password"
                                    type="password"
                                    onChange={(e) => onChange(e)}
                                    value={password}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                        <DialogContentText
                            className={classes.dialogText}
                            style={{ marginTop: "24px" }}
                        >
                            Geben Sie ihrer Session einen Namen, um ihn besser
                            zu identifizieren!
                        </DialogContentText>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="title"
                                    label="Title"
                                    type="text"
                                    onChange={(e) => onChange(e)}
                                    value={title}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogTitle>Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogText}>
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
                                    id="description"
                                    label="Description"
                                    type="text"
                                    onChange={(e) => onChange(e)}
                                    value={description}
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
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddSession;
