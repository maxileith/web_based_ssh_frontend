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
import React, { ChangeEvent, FormEvent, useState } from "react";
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
        marginBottom: '0px',
    },
}));

const AddServer = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [inputs, setInputs] = useState({
        host: "",
        user: "",
        password: "",
        provider: "",
        note: "",
        servername: "",
    });

    const { host, user, password, provider, note, servername } = inputs;

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
            host: "",
            user: "",
            password: "",
            provider: "",
            note: "",
            servername: "",
        });
        setOpen(false);
    };

    const addServer = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = { host, user, password, provider, note, servername };

        API.post("servers/add", body)
            .then((res) => {
                toast.success("Server erfolgreich hinzugefügt");
                setOpen(false);
            })
            .catch((err) => {
                console.error(err.message);
                toast.error("Server konnten nicht hinzugeführt werden");
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
                <form onSubmit={(e) => addServer(e)}>
                    <DialogTitle id="form-dialog-title">
                        Server hinzufügen
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogText} >
                            Cooler Text über Server und Zeug
                        </DialogContentText>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                            spacing={2}
                        >
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="host"
                                    label="Hostname"
                                    type="text"
                                    onChange={(e) => onChange(e)}
                                    value={host}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    margin="dense"
                                    id="user"
                                    label="User"
                                    type="text"
                                    onChange={(e) => onChange(e)}
                                    value={user}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
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
                        <DialogContentText className={classes.dialogText} style={{marginTop: '24px'}}>
                            Geben Sie ihrem Server einen Namen, um ihn besser zu identifizieren!
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    id="provider"
                                    label="Provider"
                                    type="text"
                                    onChange={(e) => onChange(e)}
                                    value={provider}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    id="note"
                                    label="Note"
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
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddServer;
