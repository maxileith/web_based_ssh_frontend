import { Card, CardActionArea, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
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
}

const ServerCard = (props: IServerCard) => {
  const server = props.server;
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid item xs={12} sm={6} md={4} key={server.id}>
      <Card className={classes.fullHeight}>
        <CardActionArea className={classes.fullHeight} onClick={() => history.push(`/client/${server.id}`)}>
          <CardContent className={classes.fullHeight}>
            <Typography gutterBottom variant="h5" component="h2">
              {server.name}
            </Typography>
            <Typography gutterBottom>
              Hostname: {server.host}, User: {server.user}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {server.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
};

export default ServerCard;