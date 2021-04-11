import React from "react";
import { Terminal } from "xterm";

interface IProps {}

export default class Term extends React.Component<IProps, {}> {
    term_dom: React.RefObject<HTMLDivElement>;
    term: Terminal;
    ws!: WebSocket;

    constructor(props: IProps) {
        super(props);

        console.log("1");

        this.term_dom = React.createRef();
        this.term = new Terminal();
        this.term.onData(this.onData);
        console.log(this.ws);
    }

    componentDidMount() {
        this.ws = new WebSocket(
            "ws://" + window.location.hostname + ":8000/ws/ssh/"
        );
        console.log("2");
        if (this.term_dom.current) this.term.open(this.term_dom.current);

        this.ws.onmessage = (e: MessageEvent<any>) => {
            const data = JSON.parse(e.data);
            if (data) this.term.write(data.data);
        };
    }

    componentWillUnmount() {
        console.log("3");
        this.term.dispose();
        this.ws.close();
    }

    onData = (data: string) => {
        const json = JSON.stringify({ data: data });
        console.log(json);
        this.ws.send(json);
    };

    render(): JSX.Element {
        return <div ref={this.term_dom}></div>;
    }
}
