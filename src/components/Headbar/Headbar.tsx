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
    setAuth(bool: boolean): void;
}

interface ISetAuth {
    setAuth(bool: boolean): void;
}

// elevates the headbar on scroll
function ElevationScroll(props: any) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

// the Headbar displaying the usermenu
function HeadbarWithChildren(props: Props) {
    const classes = useStyles();
    return (
        <>
            <CssBaseline />
            <ElevationScroll>
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

// wrapper for the headbar
export default function Headbar({ setAuth }: ISetAuth) {
    return <HeadbarWithChildren setAuth={setAuth} />;
}
