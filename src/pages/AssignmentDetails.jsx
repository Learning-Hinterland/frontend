import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout";
import { API_URL } from "../constants";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/auth";

function AssignmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assignment, setAssignment] = useState({});
  const [assignmentValue, setAssignmentValue] = React.useState({
    description: "",
    url: "",
  });
  const { token, data } = useAuthStore();
  console.log("assignment id from param", id);
  console.log("assignment data", assignment);

  const getAssignmentById = async () => {
    const res = await fetch(`${API_URL}/assignments/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get assignments by id ", json);
    setAssignment(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const getDeadline = (deadline) => {
    return `${new Date(deadline).getDate()}-${new Date(
      deadline
    ).getMonth()}-${new Date(deadline).getFullYear()} ${new Date(
      deadline
    ).getHours()}:${new Date(deadline).getMinutes()}`;
  };

  const handleChangeAssignment = (property, event) => {
    const contentCopy = { ...assignmentValue };
    contentCopy[property] = event.target.value;

    setAssignmentValue(contentCopy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("createContent id", typeof id, id);
    console.log("create assignmentValue", assignmentValue);
    try {
      const response = await fetch(`${API_URL}/assignments/${id}/submit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentValue),
      });

      const json = await response.json();
      if (json.status) {
        Swal.fire("Berhasil mengumpulkan tugas", "", "success");
      } else {
        Swal.fire(`Gagal mengumpulkan tugas, ${json.message}`, "", "error");
      }
    } catch (error) {
      Swal.fire(`Gagal mengumpulkan tugas, ${error}`, "", "error");
    } finally {
      getAssignmentById();
    }
  };

  const checkIfStudentAlreadySubmit = () => {
    console.log("data auth assignment", data);
    if (data.role === "ROLE_STUDENT") {
      const result = assignment?.submissions?.filter(
        (s) => s.user_id === data.id
      )[0]?.is_submitted;
      console.log("result check submit", result);
      return result;
    }
    return true;
  };

  useEffect(() => {
    getAssignmentById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkIfStudentAlreadySubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment, data]);

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
        onClick={() => navigate(-1)}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          Tugas
        </Typography>
      </Box>

      <Box
        sx={{
          paddingBlock: { xs: 1, md: 2 },
          paddingInline: { xs: 2, md: 8 },
        }}
        // onClick={() => navigate(`/assignment/details/${materials.id}`)}
      >
        <Box sx={{ border: "1px solid #D5D5D5", p: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
            {assignment.content}
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}>
            Deadline: {getDeadline(assignment.deadline)}
          </Typography>
          {data.role === "ROLE_STUDENT" && (
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}>
              Status:{" "}
              {checkIfStudentAlreadySubmit()
                ? "Sudah Mengumpulkan"
                : "Belum Mengumpulkan"}
            </Typography>
          )}
          {data.role === "ROLE_LECTURER" && (
            <>
              <Typography
                sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}
              >
                Siswa: {assignment.student_count}
              </Typography>
              <Typography
                sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}
              >
                Siswa yang sudah mengumpulkan:{" "}
                {assignment.student_submission_count}
              </Typography>
              <Typography
                sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}
              >
                Progress: {assignment.submission_progress}%
              </Typography>
            </>
          )}

          {data.role === "ROLE_LECTURER" &&
            assignment?.submissions?.map((s, sIdx) => {
              return (
                <Box
                  key={`submission-${sIdx}`}
                  sx={{ border: "1px solid #D5D5D5", p: 2 }}
                >
                  <Typography
                    sx={{ fontWeight: 700, fontSize: { xs: 14, md: 16 } }}
                  >
                    {s.user_name}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, fontSize: { xs: 10, md: 12 } }}
                  >
                    {getDeadline(s.date)}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, fontSize: { xs: 10, md: 12 } }}
                  >
                    Status:{" "}
                    {s.is_submitted ? "Mengumpulkan" : "Belum Mengumpulkan"}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, fontSize: { xs: 10, md: 12 } }}
                  >
                    URL:{" "}
                    <a target="_blank" href={s.url} rel="noreferrer">
                      {s.url}
                    </a>
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, fontSize: { xs: 10, md: 12 } }}
                  >
                    Deskripsi: {s.description}
                  </Typography>
                </Box>
              );
            })}
        </Box>
      </Box>
      {data.role === "ROLE_STUDENT" && !checkIfStudentAlreadySubmit() && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              paddingBlock: { xs: 1, md: 2 },
              paddingInline: { xs: 2, md: 8 },
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
              Kumpulkan Tugas
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
              <Typography
                sx={{ fontWeight: 700, fontSize: { xs: 14, md: 20 } }}
              >
                Lengkapi Info Tugas
              </Typography>
            </Box>

            <Box
              sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}
            ></Box>
            <form noValidate>
              <TextField
                onChange={(event) =>
                  handleChangeAssignment("description", event)
                }
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                type="text"
                autoFocus
              />
              <TextField
                onChange={(event) => handleChangeAssignment("url", event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="URL Dokumen (gdrive atau dropbox)"
                name="url"
                type="text"
                id="url"
              />
              <Button
                disabled={
                  assignmentValue.description === "" ||
                  assignmentValue.url === ""
                }
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                onClick={onSubmit}
              >
                Kumpulkan Tugas
              </Button>
            </form>
          </Box>
        </Box>
      )}
    </Layout>
  );
}

export default AssignmentDetails;
