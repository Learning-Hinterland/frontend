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
  Typography,
} from "@mui/material";
import Layout from "../layout";

function Profile() {
  const { token } = useAuthStore();
  const [profile, setProfile] = React.useState(null);
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
      window.alert("Failed to get profile");
    }
  };
  React.useEffect(() => {
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("profile", profile);
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
            </Grid>
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
