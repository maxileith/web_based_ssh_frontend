import { Grid, GridSize } from "@material-ui/core";
import { Fragment, useState } from "react";
import Headbar from "../../components/Headbar/Headbar";
import Client from "./Client";
import AddClient from "../../components/AddClient/AddClient";
import { toast } from "react-toastify";

interface IClient {
    setAuth(bool: boolean): void;
    match: any;
}

interface ITab {
    sessionID: number;
    screenID: number;
}

export default function ClientWrapper(props: IClient) {
    let terminalCounter = 0;

    const id = props.match.params.id;
    const [clientIds, setClientIds] = useState([
        { sessionID: id, screenID: ++terminalCounter } as ITab,
    ]);

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
            setClientIds([
                ...clientIds,
                { sessionID: id, screenID: ++terminalCounter },
            ]);
            clientCount += 1;
        } else {
            toast.warning("You can't have more than 4 clients at the time.");
        }
    };

    const remove_client = (index: number) => {
        let ids = [...clientIds];
        console.log(ids);
        ids.splice(index, 1);
        console.log(ids);
        setClientIds(ids);
    };

    return (
        <Fragment>
            <Headbar setAuth={props.setAuth} />
            <Grid container direction="row" spacing={2} alignItems="flex-start">
                {clientIds.map((client: ITab, index: number) => (
                    <Grid item xs={12} md={sizes[index]} key={client.screenID}>
                        <Client
                            id={client.sessionID}
                            clientCount={clientCount}
                            selfDestroy={remove_client}
                            index={index}
                        />
                    </Grid>
                ))}
            </Grid>
            <AddClient add={addClientId} />
        </Fragment>
    );
}
