import React, { useEffect } from "react";
import Layout from "../../layout";
import { Box, Button, TextField, Typography } from "@mui/material";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useNavigate, useParams } from "react-router-dom";
function EditCourses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [course, setCourse] = React.useState({
    name: "",
    description: "",
    cover_url: "",
  });

  const getCoursesById = async () => {
    const res = await fetch(`${API_URL}/courses/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get course ", json);
    setCourse(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleCourse = (property, event) => {
    const courseCopy = { ...course };
    courseCopy[property] = event.target.value;

    setCourse(courseCopy);
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    console.log("edit course", course);

    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      const json = await response.json();
      if (json.status) {
        alert("Berhasil edit course");
        navigate("/courses");
      } else {
        alert(`Gagal edit course, ${json.message}`);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getCoursesById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("course data", course);

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
        <form noValidate>
          <TextField
            onChange={(event) => handleCourse("name", event)}
            value={course.name}
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
            value={course.description}
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
            value={course.cover_url}
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
            onClick={handleEditCourse}
          >
            Edit Kelas
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default EditCourses;
