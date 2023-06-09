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

interface IScreen {
    sessionID: number;
    screenID: number;
}

// interact with clients, add and remove them
export default function ClientWrapper(props: IClient) {
    let [terminalCounter, setTerminalCounter] = useState(2);

    const id = props.match.params.id;
    const [clientIds, setClientIds] = useState([
        { sessionID: id, screenID: 1 } as IScreen,
    ]);

    let clientCount = clientIds.length;

    // sizing to fit screen at any time
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

    // add client to view
    const addClientId = (id: number) => {
        if (clientCount < 4) {
            setClientIds([
                ...clientIds,
                { sessionID: id, screenID: terminalCounter },
            ]);
            clientCount += 1;
            setTerminalCounter(terminalCounter + 1);
        } else {
            toast.warning("You can't have more than 4 clients at the time.");
        }
    };

    // remove client without interrupting over sessions. Triigers resize in clients
    const remove_client = (index: number) => {
        let ids = [...clientIds];
        ids.splice(index, 1);
        setClientIds(ids);
    };

    return (
        <Fragment>
            <Headbar setAuth={props.setAuth} />
            <Grid container direction="row" spacing={2} alignItems="flex-start">
                {clientIds.map((client: IScreen, index: number) => (
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
