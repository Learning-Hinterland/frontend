import React from "react";
import Layout from "../../layout";
import { Box, Button, TextField, Typography } from "@mui/material";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function CreateMaterial() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuthStore();
  const [material, setMaterial] = React.useState({
    title: "",
    description: "",
  });

  console.log("material dr course id", id);

  const handleCreateMaterial = (property, event) => {
    const materialCopy = { ...material };
    materialCopy[property] = event.target.value;

    setMaterial(materialCopy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("create material", material);
    try {
      const response = await fetch(`${API_URL}/materials`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...material, course_id: id }),
      });

      const json = await response.json();
      if (json.status) {
        Swal.fire("Berhasil membuat material", "", "success");
        navigate(`/courses/${id}`);
      } else {
        Swal.fire(`Gagal membuat material, ${json.message}`, "", "error");
      }
    } catch (error) {
      Swal.fire(error, "", "error");
    }
  };

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          Tambah Material
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
            Lengkapi Info Material
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}></Box>
        <form noValidate>
          <TextField
            onChange={(event) => handleCreateMaterial("title", event)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            type="text"
            autoFocus
          />
          <TextField
            onChange={(event) => handleCreateMaterial("description", event)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            type="text"
            id="description"
          />
          <Button
            disabled={material.description === "" || material.title === ""}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={onSubmit}
          >
            Buat Material
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default CreateMaterial;
