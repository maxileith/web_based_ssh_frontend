import { Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import API from '../../Api';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme: Theme) => ({
  fullHeight: {
    height: '100%',
  },
  deleteCard: {
    '&:hover' : {
      border: '2px solid red',
      margin: '-2px',
    },
  },
}))

interface IServerInfo {
  id: number;
  name: String;
  host: String;
  user: String;
  description?: String;
}

interface IServerCard {
  server: IServerInfo;
  edit: boolean;
}

const ServerCard = (props: IServerCard) => {
  const server = props.server;
  const edit = props.edit;
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const removeServer = (serverId: number) => {
    console.log(`Server mit ${serverId} wird gelöscht`);
    //history.go(0);
    /*API.delete('/server', serverId)
      .then((res) => {
        toast.success('Server wurde gelöscht');

      })*/
  }

  return (
    <Grid item xs={12} sm={6} md={4} key={server.id}>
      <Card className={edit ? classes.deleteCard : classes.fullHeight}>
        <CardActionArea className={classes.fullHeight} onClick={edit ? () => setOpen(true) : () => history.push(`/client/${server.id}`)}>
          <CardContent className={classes.fullHeight}>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item>
                <Typography gutterBottom variant="h5" component="h2">
                  {server.name}
                </Typography>
              </Grid>
              {edit ?
                <Grid item>
                  <DeleteIcon color="secondary"/>
                </Grid>
                :
                <></>
              }
            </Grid>
            <Typography gutterBottom>
              Hostname: {server.host}, User: {server.user}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {server.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          Server entfernen
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sind Sie sich sicher, dass sie den Server '{server.host}' löschen wollen?
            Es werden alle Daten bezüglich der Verbindung gelöscht! 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button variant="contained" color="primary" onClick={() => removeServer(server.id)}>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
};

export default ServerCard;