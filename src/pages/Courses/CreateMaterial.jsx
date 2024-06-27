import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../layout";
import { Box, Button, TextField, Typography } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useParams } from "react-router-dom";

function CreateMaterial() {
  const initialCourses = [];
  const { id } = useParams();
  const [, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
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
        body: JSON.stringify({ ...material, course_id: 0 }),
      });

      const json = await response.json();
      if (json.status) {
        alert("Berhasil membuat material");
      } else {
        alert(`Gagal membuat material, ${json.message}`);
      }
    } catch (error) {
      alert(error);
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
            Create Material
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default CreateMaterial;
