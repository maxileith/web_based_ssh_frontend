import { CircularProgress, Grid } from '@material-ui/core';
import { Fragment } from 'react';

//basic loadingindicator
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