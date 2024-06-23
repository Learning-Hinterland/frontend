import React, { useCallback, useEffect, useState } from "react";
import Layout from "../layout";
import { Box, TextField, Typography } from "@mui/material";
import useDebounce from "../hooks/useDebounce";
import { API_URL } from "../constants";
import { useAuthStore } from "../store/auth";

function Dashboard() {
  const initialCourses = [
    { name: "Bahasa Indonesia/MP1", src: "bg1.png" },
    { name: "Bahasa Inggris/MP2", src: "bg2.png" },
    { name: "Matematika/MP3", src: "bg3.png" },
    { name: "Pendidikan Agama/MP4", src: "bg4.png" },
  ];
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const { token } = useAuthStore();

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

  useEffect(() => {
    searchCourse();
  }, [debouncedValue, searchCourse]);

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
          Recently accessed Course
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexFlow: { xs: "column", md: "row wrap" },
          }}
        >
          {courses.map((c, idx) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  border: "1px solid #D9D9D9",
                  borderRadius: 2,
                  margin: 1
                }}
              >
                <Box
                  sx={{
                    backgroundImage: `url('${c.src}')`,
                    height: 100,
                    minWidth: { xs: 100, md: 300 },
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
                      width: 80,
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
              </Box>
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
