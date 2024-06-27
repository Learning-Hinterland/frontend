import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../layout";
import { Box, Button, TextField, Typography } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
function Courses() {
  const initialCourses = [];
  const navigate = useNavigate();
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const { token, data } = useAuthStore();
  console.log("current user", data);

  const searchCourse = useCallback(async () => {
    const res = await fetch(`${API_URL}/courses?search=${search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("course search", json);
    setCourses(json.data);
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
    console.log("get course ", json);
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

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          My Courses
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 6,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, md: 20 } }}>
            Course Overview
          </Typography>

          {data.role === "ROLE_ADMIN" && (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => navigate("/courses/create")}
              sx={{ m: 1 }}
            >
              Create Course
            </Button>
          )}
        </Box>

        <Box sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}></Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          {/* <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="period-select-standard-label">Period</InputLabel>
            <Select
              labelId="period-select-label"
              id="period-select"
              value={period}
              onChange={handlePeriodChange}
              label="Period"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl> */}
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
            sx={{ m: 1, width: { xs: "50%", md: "20%" } }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: "flex", md: "grid" },
            gridTemplateColumns: { xs: "none", md: "1fr 1fr 1fr 1fr" },
            justifyContent: { xs: "center", md: "none" },
            flexFlow: { xs: "column", md: "none" },
          }}
        >
          {courses.map((c, idx) => {
            return (
              <Button
                key={`course-${idx}`}
                onClick={() => navigate(`${c.id}`)}
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
                    height: 100,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      background: "#0d6efd",
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
                    Mata Pelajaran
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
      </Box>
    </Layout>
  );
}

export default Courses;
