import React, { useEffect } from "react";
import Layout from "../../layout";
import { Box, Button, TextField, Typography } from "@mui/material";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useNavigate, useParams } from "react-router-dom";

function EditMaterial() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuthStore();
  const [material, setMaterial] = React.useState({
    title: "",
    description: "",
  });

  console.log("material dr course id", id);

  const getMaterialById = async () => {
    const res = await fetch(`${API_URL}/materials/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get material ", json);
    setMaterial(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleCreateMaterial = (property, event) => {
    const materialCopy = { ...material };
    materialCopy[property] = event.target.value;

    setMaterial(materialCopy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("edit material", material);
    try {
      const response = await fetch(`${API_URL}/materials/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...material }),
      });

      const json = await response.json();
      if (json.status) {
        alert("Berhasil edit material");
        navigate(`/courses/${id}`);
      } else {
        alert(`Gagal edit material, ${json.message}`);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getMaterialById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          Edit Material
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
            value={material.title}
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
            value={material.description}
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
            Edit Material
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default EditMaterial;
