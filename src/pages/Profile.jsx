import React from "react";
import { API_URL } from "../constants";
import { useAuthStore } from "../store/auth";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Layout from "../layout";
import Swal from "sweetalert2";

function Profile() {
  const { token, data } = useAuthStore();
  const [profile, setProfile] = React.useState(null);
  const [account, setAccount] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const getProfileData = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      console.log("get profile", json);
      setProfile(json.data);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (error) {
      console.log("Failed to get profile");
    }
  };
  React.useEffect(() => {
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("profile", profile);

  const handleAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;

    setAccount(accountCopy);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    console.log("account", account);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          password: account.password,
          role: account.role,
        }),
      });
      const result = await response.json();
      console.log("create user result", result);
      if (result.status) {
        Swal.fire("Berhasil membuat user", "", "success");
        setAccount({
          name: "",
          email: "",
          password: "",
          role: "student",
        });
        //   navigate("/home");
        //   setAuthData(result.data);
        //   setAuthToken(result.data.token);
      }
      if (!result.status) {
        Swal.fire(`Gagal membuat user, ${result.message}`, "", "error");
      }
    } catch (error) {
      Swal.fire(error, "", "error");
    }
  };
  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        {profile ? (
          <Grid container direction={"column"} sx={{ overflow: "hidden" }}>
            <Grid item xs={12} md={6}>
              <img
                alt="avatar"
                style={{
                  width: "100vw",
                  height: "35vh",
                  objectFit: "cover",
                  objectPosition: "50% 50%",
                  position: "relative",
                }}
                src="https://plus.unsplash.com/premium_photo-1671069848075-c9faefe4df18?q=80&w=2873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </Grid>
            <Grid
              container
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{ position: "absolute", top: "20vh", px: { xs: 0, md: 7 } }}
            >
              <Grid item md={3}>
                <Card variant="outlined">
                  <Grid
                    container
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Grid
                      item
                      display={"flex"}
                      flexDirection={"column"}
                      sx={{ p: "1.5rem 0rem", textAlign: "center" }}
                      alignItems={"center"}
                    >
                      {" "}
                      <Avatar sx={{ width: 100, height: 100, mb: 1.5 }} />
                      <Typography variant="h6">{profile.name}</Typography>
                      <Typography color={"#D5D5D5"}>
                        {profile.role.split("_")[1]}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <Grid item md={8}>
                <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
                  <CardContent
                    sx={{
                      p: 6,
                      maxHeight: { md: "40vh" },
                      textAlign: { xs: "center", md: "start" },
                    }}
                  >
                    <FormControl fullWidth>
                      <Grid
                        container
                        direction={{ xs: "column", md: "row" }}
                        columnSpacing={5}
                        rowSpacing={3}
                      >
                        <Grid component={"form"} item xs={6}>
                          <Box>
                            <label
                              style={{ fontWeight: "bold" }}
                              htmlFor="name"
                            >
                              Name
                            </label>
                            <Typography>{profile.name}</Typography>
                          </Box>
                        </Grid>
                        <Grid component={"form"} item xs={6}>
                          <Box>
                            <label
                              style={{ fontWeight: "bold" }}
                              htmlFor="email"
                            >
                              Email
                            </label>
                            <Typography>{profile.email}</Typography>
                          </Box>
                        </Grid>
                        <Grid component={"form"} item xs={6}>
                          <Box>
                            <label
                              style={{ fontWeight: "bold" }}
                              htmlFor="lecturer_id"
                            >
                              Lecturer ID
                            </label>
                            <Typography>{profile.lecturer_id}</Typography>
                          </Box>
                        </Grid>
                        <Grid
                          container
                          justifyContent={{ xs: "center", md: "flex-end" }}
                          item
                          xs={6}
                        >
                          <Button
                            sx={{ p: "1rem 2rem", my: 2, height: "3rem" }}
                            component="button"
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={() => console.log("hello")}
                          >
                            {/* {edit.isEdit === false ? "UPDATE" : "EDIT"} */}
                            Reset Password
                          </Button>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
              {data?.role === "ROLE_ADMIN" && (
                <Grid item md={11}>
                  <Card sx={{ p: 4 }} variant="outlined">
                    <Typography variant="h6">Create User</Typography>
                    <form noValidate>
                      <TextField
                        onChange={(event) => handleAccount("name", event)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        type="text"
                        autoFocus
                      />
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
                      <Select
                        fullWidth
                        required
                        id="demo-simple-select"
                        value={account.role}
                        label="Role"
                        variant="outlined"
                        margin="normal"
                        onChange={(event) => handleAccount("role", event)}
                      >
                        <MenuItem value={"student"}>Student</MenuItem>
                        <MenuItem value={"lecturer"}>Lecturer</MenuItem>
                      </Select>
                      <Button
                        disabled={
                          account.name === "" ||
                          account.email === "" ||
                          account.password === "" ||
                          account.role === ""
                        }
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        // sx={classes.submit}
                        onClick={handleCreateUser}
                        sx={{ mt: 4 }}
                      >
                        Create User
                      </Button>
                    </form>
                  </Card>
                </Grid>
              )}
            </Grid>
            <Grid container></Grid>
            {/* <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 28 } }}>
              Profile Info
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 18, md: 24 } }}>
              Name: {profile.name}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 18, md: 24 } }}>
              Email: {profile.email}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 18, md: 24 } }}>
              Role: {profile.role}
            </Typography> */}
          </Grid>
        ) : (
          <Typography>Failed to get Profile data</Typography>
        )}
      </Box>
    </Layout>
  );
}

export default Profile;
