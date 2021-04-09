import React from "react";
import { Terminal } from "xterm";

interface IProps {}

export default function XTerm(props: IProps) {
    const ws = new WebSocket(
        "ws://" + window.location.hostname + ":8000/ws/ssh/"
    );

    const target_dom: React.RefObject<HTMLDivElement> = React.createRef();
    const terminal = new Terminal();

    React.useEffect(() => {
        // did mount
        if (target_dom.current) terminal.open(target_dom.current);
        // will unmount
        return function cleanup() {
            terminal.dispose();
            ws.close();
        };
    });

    const onData = (data: string) => {
        const json = JSON.stringify({ data: data });
        console.log(json);
        ws.send(json);
    };

    ws.onmessage = (e: MessageEvent<any>) => {
        const data = JSON.parse(e.data);
        if (data) terminal.write(data.data);
    };

    terminal.onData(onData);

    return <div ref={target_dom}></div>;
}
