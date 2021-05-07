import { Container, Grid, GridSize, GridSpacing } from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import Headbar from '../../components/Headbar/Headbar';
import Client from "./Client";
import AddClient from "../../components/AddClient/AddClient";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

interface IClient {
  setAuth(bool: boolean): void;
  match: any;
}

export default function ClientWrapper(props: IClient) {
  const id = props.match.params.id;
  const [clientIds, setClientIds] = useState([id]);

  let clientCount = clientIds.length;

  let sizes: GridSize[];
  if (clientCount === 1) {
    sizes = [12];
  } else if (clientCount === 2) {
    sizes = [6, 6];
  } else if (clientCount === 3) {
    sizes = [6, 6, 12];
  } else {
    sizes = [6, 6, 6, 6];
  }

  const addClientId = (id: number) => {
    if (clientCount < 4) {
      setClientIds([...clientIds, id]);
      clientCount += 1;
    } else {
      toast.warning("You cant have more than 4 clients at the time");
    }
  }

  const remove_client = (index: number) => {
    let ids = [...clientIds];
    console.log(ids);
    ids.splice(index, 1);
    console.log(ids);
    setClientIds(ids);
  }

  return (
    <Fragment>
      <Headbar setAuth={props.setAuth} />
      <Grid container direction="row" spacing={2} alignItems="flex-start">
        {
          clientIds.map((client: number, index:number) => (
            <Grid item xs={12} md={sizes[index]}>
              <Client id={client} clientCount={clientCount} selfDestroy={remove_client} index={index} />
            </Grid>
          ))
        }
      </Grid>
      <AddClient add={addClientId} />
    </Fragment>
  )
}