import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import { Box, Button, Typography } from "@mui/material";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useNavigate, useParams } from "react-router-dom";

function CourseById() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [lesson, setLesson] = useState([]);
  const { token, data } = useAuthStore();
  console.log("id from param", id);

  const getCourseById = async () => {
    const res = await fetch(`${API_URL}/courses/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get course by id ", json);
    setCourse(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  const getLessonByCourseId = async () => {
    const res = await fetch(`${API_URL}/materials?course_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get lesson by course id ", json);
    setLesson(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    getCourseById();
    getLessonByCourseId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          {course && course.name ? course.name : "My Courses"}
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => navigate("/courses/create")}
          sx={{ m: 1 }}
        >
          Forum Diskusi
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          m: 8,
          border: "1px solid black",
        }}
      >
        {lesson.map((l, idx) => {
          return (
            <>
              {idx !== 0 && idx !== lesson.length && (
                <Box
                  sx={{
                    mx: 4,
                    borderBottom: "4px solid #D9D9D9",
                    opacity: 0.5,
                  }}
                ></Box>
              )}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/material/edit/${l.id}`)}
                    sx={{ m: 1 }}
                  >
                    Edit
                  </Button>
                </Box>
                <Box
                  component={"div"}
                  onClick={() => navigate(`/contents/${l.id}`)}
                  sx={{ p: 4 }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                    {l.title}
                  </Typography>
                  <Typography sx={{ fontWeight: 400, fontSize: 12 }}>
                    {l.description}
                  </Typography>
                </Box>
              </Box>
            </>
          );
        })}
      </Box>
      {data.role === "ROLE_LECTURER" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => navigate(`/courses/edit/${id}`)}
            sx={{ m: 1 }}
          >
            Edit Kelas
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => navigate(`/material/create/${id}`)}
            sx={{ m: 1 }}
          >
            Tambah Material
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default CourseById;
