import React from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "../../components/Terminal/terminal.css";
import { History } from "history";
import { toast } from "react-toastify";
import { wsUrl } from "../../Api";

interface IProps {
    history: History<unknown>;
    sessionId: number;
    clientCount: number;
    selfDestroy: (index: number) => void;
    index: number;
}

interface STerm {
    alreadyGone: NodeJS.Timeout | null;
}

// terminal component. Based on xTerm
export default class Term extends React.Component<IProps, STerm> {
    term_dom: React.RefObject<HTMLDivElement>;
    term: Terminal;
    fitAddon: FitAddon;
    ws!: WebSocket;

    // setup terminal
    constructor(props: IProps) {
        super(props);

        this.term_dom = React.createRef();
        this.term = new Terminal();
        this.fitAddon = new FitAddon();

        this.term.onData(this.onData);

        // state for toast timings
        this.state = {
            alreadyGone: null,
        };
        // this.term.onResize(this.onResize);
    }

    componentDidMount() {
        // after terminal mount start ws connection
        this.ws = new WebSocket(
            wsUrl +
                "/ws/ssh/" +
                this.props.sessionId +
                "?token=" +
                localStorage.getItem("token")
        );

        // open terminal and fit to size
        this.term.loadAddon(this.fitAddon);
        if (this.term_dom.current) {
            this.term.open(this.term_dom.current);
            this.fitAddon.fit();
        }

        this.ws.onmessage = (e: MessageEvent<any>) => {
            const data = JSON.parse(e.data);
            if (data) this.term.write(data.data);
        };

        // onClose function -> what happens when you exit the terminal
        this.ws.onclose = () => {
            if (this.props.clientCount === 1) {
                this.term.write("returning to dashboard ...");
                toast.warning("Returning to dashboard.", {
                    pauseOnHover: false,
                });
                this.setState({
                    alreadyGone: setTimeout(() => {
                        this.props.history.push("/");
                    }, 5000),
                });
            } else {
                this.props.selfDestroy(this.props.index);
            }
        };
    }

    componentDidUpdate() {
        // fit terminal after client is added or removed from clients view
        this.fitAddon.fit();
    }

    // triggered by navigating back or to another view
    componentWillUnmount() {
        this.term.dispose();
        // overwrite onclose function for better ux
        this.ws.onclose = () => {};
        this.ws.close();
        // if there is a timeout, remove it
        if (this.state.alreadyGone) clearTimeout(this.state.alreadyGone);
    }

    onData = (data: string) => {
        const json = JSON.stringify({ data: data });
        this.ws.send(json);
    };

    onResize = (event: { cols: number; rows: number }) => {
        const json = JSON.stringify({ resize: [event.cols, event.rows] });
        if (this.ws) this.ws.send(json);
    };

    render(): JSX.Element {
        return <div ref={this.term_dom}></div>;
    }
}
