import React, { useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { API_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

// import users from "./../../data/users";
// import image from "./Images/image.jpg";
// import authService from "./../service/authService";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        SEKOLAH HINTERLAND
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const classes = {
  root: {
    height: "100vh",
    backgroundImage: ``,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor: "#fff",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  size: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  paper: {
    margin: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: 0,
    backgroundColor: "gray",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 1,
  },
  submit: {
    margin: 0,
  },
};
export default function Login(props) {
  const navigate = useNavigate();
  const { setAuthToken, setAuthData, token } = useAuthStore();
  console.log("token", token);
  useEffect(() => {
    if (token) {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const [account, setAccount] = React.useState({ email: "", password: "" });

  const handleAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;

    setAccount(accountCopy);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("account", account);
    try {
      if (account.email && account.password) {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: account.email,
            password: account.password,
          }),
        });
        const result = await response.json();
        console.log("result", result);
        if (result.status) {
          navigate("/home");
          setAuthData(result.data);
          setAuthToken(result.data.token);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container component="main" sx={classes.root}>
      <CssBaseline />
      {/* <Grid item xs={false} sm={4} md={7} sx={classes.image} /> */}
      <Grid
        sx={classes.size}
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={1}
        square
      >
        <div style={classes.paper}>
          <Avatar sx={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form style={classes.form} noValidate>
            <TextField
              onChange={(event) => handleAccount("email", event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              autoFocus
            />
            <TextField
              onChange={(event) => handleAccount("password", event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={classes.submit}
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
