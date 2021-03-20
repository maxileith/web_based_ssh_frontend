import { Card, CardContent, Container, Grid, makeStyles, Typography, TextField } from '@material-ui/core';
import React, { Fragment, useEffect } from 'react';
import { toast } from 'react-toastify';
import Headbar from '../../components/Headbar/Headbar';

const useStyles = makeStyles((theme) => ({
  console: {
    background: 'black',
    color: 'white',
    marginTop: theme.spacing(2),
  },
  input: {
    background: 'black',
    color: 'white',
  },
  prompt: {
    background: 'black',
    color: theme.palette.primary.main,
  }
}))

interface ISetAuth {
  setAuth(bool: boolean): void;
}

interface IMatchParams {
  id: string;
}

export default function Client({ match }: any, { setAuth }: ISetAuth) {
  const id = match.params.id;
  const classes = useStyles();

  useEffect(() => {
    //toast.success(id);
  }, []);

  return (
    <Fragment>
      <Headbar />
      <Container>
        <h1>Client Nr. {match.params.id} </h1>
        <Grid container spacing={2} alignItems="stretch" direction="row" justify="center">
          <Grid item xs={12} sm={6}>
            <Card style={{ height: '100%' }}>
              <CardContent>
                <Typography>
                  <b>Hostname:</b> traefik.webssh.leith.de <br />
                  <b>User:</b> root
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card style={{ height: '100%' }}>
              <CardContent>
                <Typography>
                  <b>Client-ID:</b> {id} <br />
                  <b>Verbunden seit:</b> 12:00
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <TextField
          fullWidth
          multiline
          InputProps={{
            className: classes.console,
          }}
          rows={10}
          rowsMax={50}
          value={"Warte auf Antwort ..."}
        />
        <Grid container style={{ width: '100%' }}>
          <Grid item style={{flexGrow: 1}}>
            <TextField
              fullWidth
              InputProps={{
                classes: {
                  disabled: classes.prompt
                }
              }}
              size="small"
              value={'niklas@pop-os:~$ asdfasdfasdfasdfs'}
              disabled
            />
          </Grid>
          <Grid item style={{flexGrow: 0}}>
            <TextField
              autoFocus
              fullWidth
              InputProps={{
                className: classes.input
              }}
              placeholder="Enter Command"
            />
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  )
}