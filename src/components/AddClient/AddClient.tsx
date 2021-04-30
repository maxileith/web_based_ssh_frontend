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
  Fab,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import API from "../../Api";
import { toast } from "react-toastify";

interface IAddClient {
  add: (id: number) => void,
}

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
  fullHeight: {
    height: "100%",
    minWidth: '200px',
  },
}));

const AddClient = (props: IAddClient) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const sessions = JSON.parse(localStorage.sessions);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addServer = (id: number) => {
    props.add(id);
    setOpen(false);
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
        <DialogTitle id="form-dialog-title">
          Add Client
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a client to add to your current view.
          </DialogContentText>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={2}
          >
            {sessions.map((session: any) => (
              <Grid item xs={6}>
                <Card className={classes.fullHeight}>
                  <CardActionArea className={classes.fullHeight} onClick={() => addServer(session.id)}>
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                      >
                        {session.title}
                      </Typography>
                      <Typography>
                        {session.hostname}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddClient;
