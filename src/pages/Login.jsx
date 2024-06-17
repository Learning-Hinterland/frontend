import React from "react";
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

// import users from "./../../data/users";
// import image from "./Images/image.jpg";
// import authService from "./../service/authService";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login(props) {
  //   if (authService.isLoggedIn()) {
  //     props.history.push("./home");
  //   }

  //   const classes = useStyles();
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

  //   console.log(typeof classes.root);

  const [account, setAccount] = React.useState({ username: "", password: "" });

  const handelAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;

    setAccount(accountCopy);
  };

  //   const isVarifiedUser = (username, password) => {
  //     return users.find(
  //       (user) => user.username === username && user.password === password
  //     );
  //   };

  const handelLogin = (e) => {
    e.preventDefault();
    console.log("account", account);
    // if (isVarifiedUser(account.username, account.password)) {
    //   authService.doLogIn(account.username);
    //   setAccount({ username: "", password: "" });
    //   props.history.push("/home");
    // }
  };

  return (
    <Grid container component="main" sx={classes.root}>
      <CssBaseline />
      {/* <Grid item xs={false} sm={4} md={7} className={classes.image} /> */}
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
              onChange={(event) => handelAccount("username", event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              onChange={(event) => handelAccount("password", event)}
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
              onClick={handelLogin}
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
