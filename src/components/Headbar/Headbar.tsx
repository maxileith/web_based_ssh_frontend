import {
    AppBar,
    createStyles,
    CssBaseline,
    makeStyles,
    Theme,
    Toolbar,
    Typography,
    useScrollTrigger,
} from "@material-ui/core";
import React from "react";
import UserMenu from "../UserMenu/UserMenu";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },
    })
);

interface Props {
    children: React.ReactElement;
    setAuth(bool: boolean): void;
}

interface ISetAuth {
    setAuth(bool: boolean): void;
}

function ElevationScroll(props: Props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

function HeadbarWithChildren(props: Props) {
    const classes = useStyles();
    return (
        <>
            <CssBaseline />
            <ElevationScroll {...props}>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Web Based SSH Client
                        </Typography>
                        <UserMenu setAuth={props.setAuth} />
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar style={{ marginBottom: "16px" }} />
        </>
    );
}

export default function Headbar({ setAuth }: ISetAuth) {
    return <HeadbarWithChildren children={<></>} setAuth={setAuth} />;
}
