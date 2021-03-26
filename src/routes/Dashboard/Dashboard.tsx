import { Card, CardActionArea, CardContent, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { useHistory } from 'react-router';
import Headbar from '../../components/Headbar/Headbar';
import ServerCard from '../../components/ServerCard/ServerCard';
import AddServer from '../../components/AddServer/AddServer';

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
  },
}))

interface ISetAuth {
  setAuth(bool: boolean): void;
}

interface IServerInfo {
  id: number;
  name: String;
  host: String;
  user: String;
  description?: String;
}

const dummyServer = [
  { id: 10, name: 'Debian', host: 'https://traefik.webssh.leith.de/', user: 'root', description: 'Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft' },
  { id: 11, name: 'Debian', host: 'https://traefik.webssh.leith.de/', user: 'root', description: 'Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft' },
  { id: 12, name: 'Debian', host: 'https://traefik.webssh.leith.de/', user: 'root', description: 'Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft' },
  { id: 13, name: 'Debian', host: 'https://traefik.webssh.leith.de/', user: 'root', description: 'Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft' },
  { id: 14, name: 'Debian', host: 'https://traefik.webssh.leith.de/', user: 'root', description: 'Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft' },
  { id: 15, name: 'Debian', host: 'https://traefik.webssh.leith.de/', user: 'root', description: 'Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft' }
]

export default function Dashboard({ setAuth }: ISetAuth) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Fragment>
      <Headbar />
      <Container>
        <Grid container spacing={2} alignItems="stretch" direction="row" justify="center">
          <Grid item xs={12}>
            <Typography variant="h3" component="h1">
              Liste aller ihrer Server
            </Typography>
          </Grid>
          {dummyServer.map((server: IServerInfo) => (
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
          ))}
          {[...new Array(5)]
            .map((now, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className={classes.fullHeight}>
                    <CardActionArea className={classes.fullHeight} onClick={() => history.push(`/client/${index}`)}>
                      <CardContent className={classes.fullHeight}>
                        <Typography gutterBottom variant="h5" component="h2">
                          Servername
                        </Typography>
                        <Typography gutterBottom>
                          Hostname: traefik.webssh.leith.de, User: root
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              )
            })
          }
          <Grid item xs={12} sm={6} md={4} key={123}>
            <Card>
              <CardActionArea onClick={() => history.push(`/client/234`)}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Servername
                        </Typography>
                  <Typography gutterBottom>
                    Hostname: 8.8.8.8, User: root
                        </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft
                    Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft
                    Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft
                    Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft
                    Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft
                    Eine fancy Beschreibung, was auf deinem super geilem Server grade läuft
                        </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          {dummyServer.map((server: IServerInfo) => (
            <ServerCard server={server} />
          ))}
        </Grid>
        <AddServer />
      </Container>
    </Fragment>
  )
}