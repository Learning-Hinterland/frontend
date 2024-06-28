import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Delete } from "@mui/icons-material";

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

  const enrollCourseById = async () => {
    const res = await fetch(`${API_URL}/courses/${id}/enroll`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return await json;
  };
  const unenrollCourseById = async () => {
    const res = await fetch(`${API_URL}/courses/${id}/unenroll`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return await json;
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
        onClick={() => navigate(-1)}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          {course && course.name ? course.name : "My Courses"}
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {data.role === "ROLE_STUDENT" && (
          <Button
            type="button"
            variant="contained"
            color={course.is_enrolled ? "error" : "primary"}
            onClick={() =>
              Swal.fire({
                title: `Do you want to ${
                  course.is_enrolled ? "unenroll" : "enroll"
                } to this course?`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Don't save`,
              }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed && course.is_enrolled) {
                  try {
                    const result = await unenrollCourseById();
                    if (result.status)
                      Swal.fire("Course Unenrolled!", "", "success");
                    if (!result.status)
                      Swal.fire("Course Failed To Unenrolled!", "", "error");
                  } catch (error) {
                    Swal.fire(error.message, "", "error");
                  } finally {
                    getCourseById();
                  }
                }
                if (result.isConfirmed && !course.is_enrolled) {
                  try {
                    const result = await enrollCourseById();
                    if (result.status)
                      Swal.fire("Course Enrolled!", "", "success");
                    if (!result.status)
                      Swal.fire("Course Failed To Enrolled!", "", "error");
                  } catch (error) {
                    Swal.fire(error, "", "error");
                  } finally {
                    getCourseById();
                  }
                }
                if (result.isDenied) {
                  Swal.fire("Changes are not saved", "", "info");
                }
              })
            }
            sx={{ m: 1 }}
          >
            {course.is_enrolled ? "Unenroll" : "Enroll"}
          </Button>
        )}
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
                {data.role === "ROLE_LECTURER" && (
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
                    <IconButton
                      color="error"
                      onClick={() =>
                        Swal.fire({
                          title: `Do you want to delete material: ${l.title}?`,
                          showDenyButton: true,
                          showCancelButton: true,
                          confirmButtonText: "Delete",
                          denyButtonText: `Don't delete`,
                        }).then(async (result) => {
                          /* Read more about isConfirmed, isDenied below */
                          if (result.isConfirmed) {
                            try {
                              const response = await fetch(
                                `${API_URL}/materials/${l.id}`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Accept: "application/json",
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                  },
                                }
                              );

                              const json = await response.json();
                              if (json.status) {
                                Swal.fire("Delete Success", "", "success");
                              } else {
                                Swal.fire("Delete Failed", "", "error");
                              }
                            } catch (error) {
                              Swal.fire(error.message, "", "error");
                            } finally {
                              getCourseById();
                              getLessonByCourseId();
                            }
                          }
                          if (result.isDenied) {
                            Swal.fire("Delete Canceled", "", "info");
                          }
                        })
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}
                <Box
                  component={"div"}
                  onClick={() => {
                    if (data.role === "ROLE_LECTURER" || course.is_enrolled)
                      navigate(`/contents/${l.id}`);
                    else
                      Swal.fire("Kamu belum enroll ke kelas ini!", "", "info");
                  }}
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
