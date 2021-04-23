import React from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "../../components/Terminal/terminal.css";
import { History } from "history";
import { toast } from "react-toastify";

interface IProps {
    history: History<unknown>;
    sessionId: number;
}

interface STerm {
    alreadyGone: NodeJS.Timeout | null;
}

export default class Term extends React.Component<IProps, STerm> {
    term_dom: React.RefObject<HTMLDivElement>;
    term: Terminal;
    fitAddon: FitAddon;
    ws!: WebSocket;

    constructor(props: IProps) {
        super(props);

        this.term_dom = React.createRef();
        this.term = new Terminal();
        this.fitAddon = new FitAddon();

        this.term.onData(this.onData);

        this.state = {
            alreadyGone: null,
        };
        // this.term.onResize(this.onResize);
    }

    componentDidMount() {
        this.ws = new WebSocket(
            "ws://" +
            window.location.hostname +
            ":8000/ws/ssh/" +
            this.props.sessionId +
            "?token=" +
            localStorage.getItem("token")
        );

        this.term.loadAddon(this.fitAddon);
        if (this.term_dom.current) {
            this.term.open(this.term_dom.current);
            this.fitAddon.fit();
        }

        this.ws.onmessage = (e: MessageEvent<any>) => {
            const data = JSON.parse(e.data);
            if (data) this.term.write(data.data);
        };

        this.ws.onclose = () => {
            this.term.write("returning to dashboard ...");
            toast.warning("Returning to dashboard.", { pauseOnHover: false });
            console.log(this.state);
            this.setState({
                alreadyGone: setTimeout(() => {
                    this.props.history.push("/");
                }, 5000),
            });
        };
    }

    componentWillUnmount() {
        this.term.dispose();
        this.ws.onclose = () => {};
        this.ws.close();
        if (this.state.alreadyGone) clearTimeout(this.state.alreadyGone);
    }

    onData = (data: string) => {
        const json = JSON.stringify({ data: data });
        this.ws.send(json);
    };

    onResize = (event: { cols: number; rows: number }) => {
        const json = JSON.stringify({ resize: [event.cols, event.rows] });
        console.log(json);
        if (this.ws) this.ws.send(json);
    };

    render(): JSX.Element {
        return <div ref={this.term_dom}></div>;
    }
}
