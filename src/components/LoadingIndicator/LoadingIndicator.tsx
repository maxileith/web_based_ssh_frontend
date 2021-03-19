import { CircularProgress, Grid } from '@material-ui/core';
import React, { Fragment } from 'react';

export default function LoadingIndicator() {
  return (
    <Fragment>
      <Grid container direction="column" alignItems="center" justify="center" alignContent="center">
        <Grid item>
          <CircularProgress size='80px' />
        </Grid>
      </Grid>
    </Fragment>
  );
}