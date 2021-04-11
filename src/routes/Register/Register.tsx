import { Button, Checkbox, Container, FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup, TextField, Typography } from "@material-ui/core";
import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import API from '../../Api';
import Headbar from "../../components/Headbar/Headbar";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

interface IRegister {
  setAuth(bool: boolean): void;
}

const Register = ({ setAuth }: IRegister) => {

  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [showLoadingError, setShowLoadingError] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const { first_name, last_name, email, username, password } = inputs;

  const onChangeText = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = { first_name, last_name, email, password, username };
    console.log(body);

    API.post('auth/register', body)
      .then((res) => {
        if (res.data.token) {
          //localStorage.setItem('token', res.data.token);
          history.push('/login');
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            toast.error(err.response.data);
          } 
        } else {
          console.error(err.message);
        }
      })
  }

  return (
    <>
      <Headbar setAuth={setAuth} />
      <Container>
        <Fragment>
          <h1>Register</h1>
          <form onSubmit={onSubmitForm}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="Vorname"
              name="first_name"
              value={first_name}
              onChange={e => onChangeText(e)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Nachname"
              name="last_name"
              value={last_name}
              onChange={e => onChangeText(e)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-Mail"
              name="email"
              value={email}
              onChange={e => onChangeText(e)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={e => onChangeText(e)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => onChangeText(e)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Registrieren
          </Button>
          </form>
        </Fragment>
      </Container>
    </>
  );
}

export default Register;
