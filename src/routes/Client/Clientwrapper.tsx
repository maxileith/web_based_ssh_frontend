import { Container, Grid } from '@material-ui/core';
import React, { Fragment } from 'react';
import Headbar from '../../components/Headbar/Headbar';
import Client from "./Client";

interface IClient {
  setAuth(bool: boolean): void;
}

export default function ClientWrapper({ match }: any, props: IClient) {
  //const id1 = match.params.id1;
  //const id2 = match.params.id2;

  return (
  <Fragment>
    <Headbar setAuth={props.setAuth} />
      <Grid container direction="row" spacing={2} alignItems="flex-start">
        <Grid item xs={6}>
          <Client id={1} />
        </Grid>
        <Grid item xs={6}>
          <Client id={7} />
        </Grid>
      </Grid>
  </Fragment>)
}