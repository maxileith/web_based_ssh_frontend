import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@material-ui/core";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import API from "../../Api";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

export interface ISessionInfo {
    id: number;
    title: String;
    hostname: String;
    username: String;
    description: String;
    port: number;
    key_file: boolean;
}

interface IConfigModal {
    open: boolean;
    setOpen: (bool: boolean) => void;
    session: ISessionInfo;
    update: (session: ISessionInfo) => void;
}

// modal to config sessions details
export default function ConfigSessionModal(props: IConfigModal) {
    const [inputs, setInputs] = useState({
        id: props.session.id,
        hostname: props.session.hostname,
        username: props.session.username,
        password: "",
        description: props.session.description,
        title: props.session.title,
        port: props.session.port,
    });
    const [changePassword, setChangePassword] = useState(false);
    const [deleteKeyFile, setDeleteKeyFile] = useState(false);
    const [disable, setDisable] = useState(false);
    const [keyFile, setKeyFile] = useState<File | null>();
    const [disableUpload, setDisableUpload] = useState(false);
    const [disablePassword, setDisablePassword] = useState(true);
    const [disableDeleteKeyFile, setDisableDeleteKeyFile] = useState(!props.session.key_file);
    const [disableChangePasswordBox, setDisableChangePasswordBox] = useState(props.session.key_file);

    const { hostname, username, password, description, title, port } = inputs;

    const handleClose = () => {
        props.setOpen(false);
    };

    const onChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs({ ...inputs, [e.target.id]: e.target.value });
    };

    // set inputs back to session infos
    const refreshModal = () => {
        setInputs({
            id: props.session.id,
            hostname: props.session.hostname,
            username: props.session.username,
            password: "",
            description: props.session.description,
            title: props.session.title,
            port: props.session.port,
        });
        handleClose();
        setDisablePassword(props.session.key_file);
        setKeyFile(null);
        setDisableUpload(false);
        setDisableChangePasswordBox(props.session.key_file);
        setDisableDeleteKeyFile(!props.session.key_file);
    };

    const handlePasswordChange = () => {
        setChangePassword(!changePassword);
        setDisablePassword(changePassword);
    };

    // filter input for changes and prepare JSON to send
    const updateServerInformations = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisable(true);
        let newInformations = {};
        if (hostname !== props.session.hostname) {
            newInformations = { hostname: hostname };
        }
        if (port !== props.session.port) {
            newInformations = { ...newInformations, port: port };
        }
        if (username !== props.session.username) {
            newInformations = { ...newInformations, username: username };
        }
        if (description !== props.session.description) {
            newInformations = { ...newInformations, description: description };
        }
        if (title !== props.session.title) {
            newInformations = { ...newInformations, title: title };
        }
        if (changePassword) {
            newInformations = { ...newInformations, password: password };
        }
        // if information has changed, send changes to server
        if (Object.keys(newInformations).length > 0) {
            let newSession: any = inputs;
            delete newSession.password;
            API.patch(
                `/saved_sessions/details/${props.session.id}`,
                newInformations
            )
                .then((res) => {
                    props.update(newSession);
                    toast.success(res.data.message);
                    setDisable(false);
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
            // Add api-call to update informations
        } else {
            setDisable(false);
            toast.success("No changes to apply.");
        }
        if (keyFile) {
            const formData = new FormData();
            formData.append('key_file', keyFile);
            API.post(`saved_sessions/details/${props.session.id}/key`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', }
            })
                .then(() => {
                    toast.success("Key file uploaded successfully");
                })
                .catch(() => {
                    toast.error("Could not upload key file");
                });
        } else if (deleteKeyFile) {
            API.delete(`saved_sessions/details/${props.session.id}/key`)
                .then(() => {
                    toast.success("Deleted key file!");
                })
                .catch(() => {
                    toast.error("Could not delete key file.");
                })
        }
        props.setOpen(false);
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
            setDisableDeleteKeyFile(true);
            setDisableChangePasswordBox(true);
        }
    }

    const removeKeyFile = () => {
        setKeyFile(null);
        setDisablePassword(props.session.key_file);
        setDisableUpload(false);
        setDisableDeleteKeyFile(!props.session.key_file);
        setDisableChangePasswordBox(props.session.key_file);
    }

    const handleDeleteKeyFile = () => {
        setDisableUpload(!deleteKeyFile);
        setDisableChangePasswordBox(deleteKeyFile);
        if (deleteKeyFile) {
            setChangePassword(!deleteKeyFile);
            setDisablePassword(deleteKeyFile);
        }
        setDeleteKeyFile(!deleteKeyFile);
    }

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <form onSubmit={(e) => updateServerInformations(e)}>
                <DialogTitle>Edit Session Details</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Provide the following information to identify the host
                        and authenticate.
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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={changePassword}
                                        onChange={handlePasswordChange}
                                        color="primary"
                                    />
                                }
                                label="I want to change my password"
                                disabled={disableChangePasswordBox}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={deleteKeyFile}
                                        onChange={handleDeleteKeyFile}
                                        color="primary"
                                    />
                                }
                                label="I want to delete my key file"
                                disabled={disableDeleteKeyFile}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={(e) => uploadFile(e.target.files)}
                                disabled={disableUpload  || changePassword}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" component="span" color="primary" disabled={disableUpload || changePassword} >
                                    Upload New Key File
                                    </Button>
                            </label>
                        </Grid>
                        {
                            keyFile ? (
                                <>
                                    <Grid item>
                                        <Typography>
                                            {keyFile.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={removeKeyFile}>
                                            <HighlightOffIcon color="secondary" />
                                        </IconButton>
                                    </Grid>
                                </>
                            ) : ""
                        }
                    </Grid>
                </DialogContent>
                <DialogTitle>Details</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Give the session a title and optionally a description.
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
                    <Button type="submit" color="primary" disabled={disable}>
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
