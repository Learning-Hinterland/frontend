import React, { useRef } from "react";
import Layout from "../../layout";
import { Box, Button, TextField, Typography } from "@mui/material";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useNavigate, useParams } from "react-router-dom";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";

function CreateContent() {
  const rteRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuthStore();
  const [content, setContent] = React.useState({
    title: "",
    video_url: "",
  });
  const [body, setBody] = React.useState("");
  console.log("body", body);
  console.log("content dr course id", id);

  const handleCreateContent = (property, event) => {
    const contentCopy = { ...content };
    contentCopy[property] = event.target.value;

    setContent(contentCopy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("create content", content);
    try {
      const response = await fetch(`${API_URL}/contents`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...content, material_id: id, body: body }),
      });

      const json = await response.json();
      if (json.status) {
        alert("Berhasil membuat content");
        navigate(`/contents/${id}`);
      } else {
        alert(`Gagal membuat content, ${json.message}`);
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
          Tambah Konten
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
            Lengkapi Info Konten
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}></Box>
        <form noValidate>
          <TextField
            onChange={(event) => handleCreateContent("title", event)}
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
          <div>
            <RichTextEditor
              ref={rteRef}
              extensions={[StarterKit]} // Or any Tiptap extensions you wish!
              content="<p>Ketik Isi Konten Disini</p>" // Initial content for the editor
              // Optionally include `renderControls` for a menu-bar atop the editor:
              renderControls={() => (
                <MenuControlsContainer>
                  <MenuSelectHeading />
                  <MenuDivider />
                  <MenuButtonBold />
                  <MenuButtonItalic />
                  {/* Add more controls of your choosing here */}
                </MenuControlsContainer>
              )}
              onUpdate={(e) => {
                console.log(e.editor?.getHTML());
                setBody(e.editor?.getHTML());
              }}
            />

            <Button
              onClick={() => console.log(rteRef.current?.editor?.getHTML())}
            >
              Log HTML
            </Button>
          </div>
          <TextField
            onChange={(event) => handleCreateContent("video_url", event)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Video URL"
            name="video_url"
            type="text"
            id="video_url"
          />
          <Button
            disabled={
              content.body === "" ||
              content.title === "" ||
              content.video_url === ""
            }
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={onSubmit}
          >
            Buat Konten
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default CreateContent;
