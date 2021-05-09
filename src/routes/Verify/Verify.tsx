import {
    Button,
    Container,
    createStyles,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Headbar from "../../components/Headbar/Headbar";
import API from "../../Api";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useHistory } from "react-router";
import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        doneIcon: {
            color: "#00e676",
            height: "60vh",
            width: "60vw",
        },
        errorIcon: {
            color: "#dc3545",
            height: "60vh",
            width: "60vw",
        },
    })
);

interface IRegister {
    setAuth(bool: boolean): void;
}

// verify email
const Verify = ({ match }: any, { setAuth }: IRegister) => {
    const token = match.params.token;
    const [sucess, setSucess] = useState(false);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const history = useHistory();

    // send token to server to verify
    useEffect(() => {
        API.get(`auth/email/verify/${token}`)
            .then((res) => {
                if (res.status === 200) {
                    setSucess(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    // return loading indicator while loading, otherwise return success / failure
    if (loading) {
        return (
            <>
                <Headbar setAuth={setAuth} />
                <Container>
                    <LoadingIndicator />
                </Container>
            </>
        );
    } else if (sucess) {
        return (
            <>
                <Headbar setAuth={setAuth} />
                <Container>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="center"
                        alignContent="center"
                    >
                        <Grid item>
                            <CheckCircleIcon className={classes.doneIcon} />
                        </Grid>
                        <Grid item>
                            <Typography
                                component="h2"
                                variant="h4"
                                align="center"
                                gutterBottom
                            >
                                You verified successfully!
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => history.push("/login")}
                            >
                                Got to Login
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </>
        );
    } else {
        return (
            <>
                <Headbar setAuth={setAuth} />
                <Container>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="center"
                        alignContent="center"
                    >
                        <Grid item>
                            <ErrorIcon className={classes.errorIcon} />
                        </Grid>
                        <Grid item>
                            <Typography
                                component="h2"
                                variant="h4"
                                align="center"
                                gutterBottom
                            >
                                Verification failed!
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </>
        );
    }
};

export default Verify;
