import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../layout";
import { Box, Button, TextField, Typography } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
function CreateCourses() {
  const initialCourses = [];
  const [, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const { token } = useAuthStore();
  const [course, setCourse] = React.useState({
    name: "",
    description: "",
    cover_url: "",
  });

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

  const handleCourse = (property, event) => {
    const courseCopy = { ...course };
    courseCopy[property] = event.target.value;

    setCourse(courseCopy);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    console.log("create course", course);
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

          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => console.log("click create")}
            sx={{ m: 1 }}
          >
            Create Course
          </Button>
        </Box>

        <Box sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}></Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
        <form noValidate>
          <TextField
            onChange={(event) => handleCourse("name", event)}
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
            onChange={(event) => handleCourse("description", event)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            type="text"
            id="description"
          />
          <TextField
            onChange={(event) => handleCourse("cover_url", event)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Cover URL"
            name="Cover URL starting with https://"
            type="text"
            id="cover_url"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // sx={classes.submit}
            onClick={handleCreateCourse}
          >
            Create Course
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default CreateCourses;
