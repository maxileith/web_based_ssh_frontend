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
    TextField,
} from "@material-ui/core";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import API from "../../Api";

export interface ISessionInfo {
    id: number;
    title: String;
    hostname: String;
    username: String;
    description: String;
    port: number;
}

interface IConfigModal {
    open: boolean;
    setOpen: (bool: boolean) => void;
    session: ISessionInfo;
    update: (session: ISessionInfo) => void;
}

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

    const { hostname, username, password, description, title, port } = inputs;

    const handleClose = () => {
        props.setOpen(false);
    };

    const onChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs({ ...inputs, [e.target.id]: e.target.value });
    };

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
    };

    const handlePasswordChange = () => {
        setChangePassword(!changePassword);
    };

    const updateServerInformations = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
                })
                .catch((err) => {
                    if (err.response && err.response.data) {
                        toast.error(err.response.data.message);
                    } else {
                        toast.error(err.message);
                        console.error(err.message);
                    }
                });
            // Add api-call to update informations
        } else {
            toast.success("No changes to apply.");
        }
        props.setOpen(false);
    };

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
                            />
                        </Grid>
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
                    <Button type="submit" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
