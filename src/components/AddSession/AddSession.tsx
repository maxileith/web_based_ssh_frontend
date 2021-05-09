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
    Typography,
} from "@material-ui/core";
import { ChangeEvent, FormEvent, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import API from "../../Api";
import { toast } from "react-toastify";
import { ISessionInfo } from "../SessionCard/ConfigSessionModal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

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

interface IAddSession {
    addSession: (session: ISessionInfo) => void;
}

// modal to add new session on dashboard
const AddSession = (props: IAddSession) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [inputs, setInputs] = useState({
        hostname: "",
        username: "root",
        password: "",
        description: "",
        title: "",
        port: 22,
    });
    const [disable, setDisable] = useState(false);
    const [keyFile, setKeyFile] = useState<File | null>();
    const [disableUpload, setDisableUpload] = useState(false);
    const [disablePassword, setDisablePassword] = useState(false);

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
        let additionalChanges = {};
        if (e.target.id === "password") {
            if (e.target.value === "") {
                setDisableUpload(false);
            } else {
                setDisableUpload(true);
            }
        } else if (e.target.id === "hostname" && hostname === title) {
            additionalChanges = { title: e.target.value };
        }
        setInputs({
            ...inputs,
            ...additionalChanges,
            [e.target.id]: e.target.value,
        });
    };

    // set inputs to default
    const refreshModal = () => {
        setInputs({
            hostname: "",
            username: "root",
            password: "",
            description: "",
            title: "",
            port: 22,
        });
        setKeyFile(null);
        setOpen(false);
    };

    // add session to database
    const addSession = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisable(true);

        API.post("saved_sessions/", inputs)
            .then((res) => {
                toast.success(res.data.message);
                // add session to dashboard without reload
                props.addSession(res.data.details);
                if (keyFile) {
                    const formData = new FormData();
                    formData.append("key_file", keyFile);
                    API.post(
                        `saved_sessions/details/${res.data.details.id}/key`,
                        formData,
                        {
                            headers: { "Content-Type": "multipart/form-data" },
                        }
                    )
                        .then((res) => {
                            toast.success("Key file uploaded successfully");
                        })
                        .catch((err) => {
                            toast.error("Could not upload key file");
                        });
                }
                refreshModal();
                setDisable(false);
                setOpen(false);
            })
            .catch((err) => {
                setDisable(false);
                if (err.response && err.response.data) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.message);
                    console.error(err.message);
                }
            });
    };

    const uploadFile = (files: HTMLInputElement["files"] | null) => {
        if (files === null) {
            toast.warning("No files provided");
        } else if (files.length > 1) {
            toast.warning("You can only upload one file");
        } else {
            setKeyFile(files[0]);
            setDisablePassword(true);
            setDisableUpload(true);
        }
    };

    const removeKeyFile = () => {
        setKeyFile(null);
        setDisablePassword(false);
        setDisableUpload(false);
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
                onClose={refreshModal}
                aria-labelledby="form-dialog-title"
            >
                <form onSubmit={(e) => addSession(e)}>
                    <DialogTitle id="form-dialog-title">
                        {title ? title : "Add Session"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogText}>
                            Provide the following information to identify the
                            host and authenticate.
                        </DialogContentText>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
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
                                    inputProps={{ min: 1, max: 65535 }}
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
                                    disabled={disablePassword}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    style={{ display: "none" }}
                                    id="raised-button-file"
                                    type="file"
                                    onChange={(e) => uploadFile(e.target.files)}
                                    disabled={disableUpload}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        color="primary"
                                        disabled={disableUpload}
                                    >
                                        Upload Key File
                                    </Button>
                                </label>
                            </Grid>
                            {keyFile ? (
                                <>
                                    <Grid item>
                                        <Typography>{keyFile.name}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={removeKeyFile}>
                                            <HighlightOffIcon color="secondary" />
                                        </IconButton>
                                    </Grid>
                                </>
                            ) : (
                                ""
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogTitle>Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogText}>
                            Give the session a title and optionally a
                            description.
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
                                    id="title"
                                    label="Title"
                                    type="text"
                                    onChange={(e) => onChange(e)}
                                    value={title}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
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
                        <Button
                            type="submit"
                            color="primary"
                            disabled={disable}
                        >
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddSession;
