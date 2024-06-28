import React, { useEffect, useRef } from "react";
import Layout from "../../layout";
import { Box, Button, TextField, Typography } from "@mui/material";
import { API_URL } from "../../constants";
import { useAuthStore } from "../../store/auth";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";

function EditContent() {
  const rteRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuthStore();
  const [body, setBody] = React.useState("");
  const [content, setContent] = React.useState({
    title: "",
    video_url: "",
  });

  console.log("content dr course id", id);

  const getContentById = async () => {
    const res = await fetch(`${API_URL}/contents/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get content ", json);
    setContent(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleCreateMaterial = (property, event) => {
    const materialCopy = { ...content };
    materialCopy[property] = event.target.value;

    setContent(materialCopy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("edit content", content);
    try {
      const response = await fetch(`${API_URL}/contents/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...content, body }),
      });

      const json = await response.json();
      if (json.status) {
        Swal.fire("Berhasil edit content", "", "success");
        navigate(-1);
      } else {
        Swal.fire(`Gagal edit content, ${json.message}`, "", "error");
      }
    } catch (error) {
      Swal.fire(`Gagal edit content, ${error}`, "", "error");
    }
  };

  useEffect(() => {
    getContentById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        <Box component={"div"} onClick={() => navigate(-1)}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
            Edit Konten
          </Typography>
        </Box>

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
            value={content.title}
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
          {content?.body && (
            <div>
              <RichTextEditor
                ref={rteRef}
                extensions={[StarterKit]} // Or any Tiptap extensions you wish!
                content={`<div>${content?.body}<div>`} // Initial content for the editor
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
          )}
          <TextField
            value={content.video_url}
            onChange={(event) => handleCreateMaterial("video_url", event)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Video Url"
            name="video_url"
            type="text"
            id="video_url"
          />
          <Button
            disabled={content.body === "" || content.title === ""}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={onSubmit}
          >
            Edit Konten
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default EditContent;
