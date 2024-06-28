import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { API_URL } from "../constants";
import Layout from "../layout";
import { useAuthStore } from "../store/auth";
import Swal from "sweetalert2";

function CreateAssignment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuthStore();
  const [deadline, setDeadline] = React.useState("");
  const [assignment, setAssignment] = React.useState({
    content: "",
  });
  console.log("content dr course id", id);

  const handleCreateAssignment = (property, event) => {
    const assignmentCopy = { ...assignment };
    assignmentCopy[property] = event.target.value;

    setAssignment(assignmentCopy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...assignment,
          deadline,
          material_id: parseInt(id),
        }),
      });

      const json = await response.json();
      if (json.status) {
        Swal.fire("Berhasil membuat tugas", "", "success");
        navigate(-1);
      } else {
        Swal.fire(`Gagal membuat tugas, ${json.message}`, "", "error");
      }
    } catch (error) {
        Swal.fire(`Gagal membuat tugas, ${error}`, "", "error");
    }
  };

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          Buat Tugas
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
            Lengkapi Info Tugas
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}></Box>
        <form noValidate>
          <TextField
            onChange={(event) => handleCreateAssignment("content", event)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="content"
            label="Description"
            name="content"
            type="text"
            autoFocus
          />
          <DateTimePicker
            label="Deadline"
            onChange={(event) => {
              console.log("deadline", event.format());
              setDeadline(event.format());
            }}
            sx={{ width: "100%" }}
          />
          <Button
            disabled={assignment.content === "" || deadline === ""}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={onSubmit}
          >
            Buat Tugas
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default CreateAssignment;
