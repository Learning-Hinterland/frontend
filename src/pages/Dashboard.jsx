import React, { useCallback, useEffect, useState } from "react";
import Layout from "../layout";
import { Box, Button, Typography } from "@mui/material";
import useDebounce from "../hooks/useDebounce";
import { API_URL } from "../constants";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState();
  const [search] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const { token, data } = useAuthStore();

  const searchCourse = useCallback(async () => {
    const res = await fetch(`${API_URL}/courses?search=${search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("course search", json);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const getCourses = async () => {
    const res = await fetch(`${API_URL}/courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("dashboard get course ", json);
    setCourses(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    searchCourse();
  }, [debouncedValue, searchCourse]);

  useEffect(() => {
    getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('auth data dashboard', data)
  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          Dashboard
        </Typography>

        <Typography
          sx={{ fontWeight: 700, fontSize: { xs: 14, md: 20 }, mt: 6 }}
        >
          My Courses
        </Typography>

        <Box
          sx={{
            display: { xs: "flex", md: "grid" },
            gridTemplateColumns: { xs: "none", md: "1fr 1fr 1fr 1fr" },
            justifyContent: { xs: "center", md: "none" },
            flexFlow: { xs: "column", md: "none" },
          }}
        >
          {courses
            ?.filter((f) => {
              if (data.role === "ROLE_STUDENT") return f.is_enrolled;
              return f
            })
            .map((c, idx) => {
              return (
                <Button
                  key={`course-${idx}`}
                  onClick={() => navigate(`/courses/${c.id}`)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    border: "1px solid #D9D9D9",
                    borderRadius: 2,
                    margin: 1,
                    maxWidth: { xs: "100%", md: 300 },
                  }}
                >
                  <Box
                    sx={{
                      backgroundImage: `url('${c.cover_url}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: 100,
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        background: "green",
                        color: "white",
                        paddingBlock: 0.5,
                        paddingInline: 1,
                        fontSize: 10,
                        fontWeight: 700,
                        width: 100,
                        margin: 1,
                        borderRadius: 1,
                      }}
                    >
                      Enrolled
                    </Box>
                    {/* <img src={c.src} alt={`course-${idx}`} width={200} /> */}
                  </Box>
                  <Box
                    sx={{
                      paddingBlock: 1,
                      paddingInline: 2,
                      textAlign: "left",
                      fontSize: 12,
                    }}
                  >
                    {c.name}
                  </Box>
                </Button>
              );
            })}
        </Box>
        {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            onChange={(event) => {
              console.log("search coure", event.target.value);
              setSearch(event.target.value);
            }}
            variant="outlined"
            margin="normal"
            fullWidth
            id="search"
            label="Search courses"
            name="search"
            type="text"
            autoFocus
            sx={{ width: "50%" }}
          />
        </Box> */}
        <Box sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}></Box>
      </Box>
    </Layout>
  );
}

export default Dashboard;
