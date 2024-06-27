import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Layout from "../layout";
import { API_URL } from "../constants";
import { useAuthStore } from "../store/auth";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "mui-tiptap";
function ContentByMaterialId() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course] = useState({});
  const [content, setContent] = useState([]);
  const { token, data } = useAuthStore();
  console.log("id from param", id);

  const getContentsByMaterialId = async () => {
    const res = await fetch(`${API_URL}/contents?material_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get content by material id ", json);
    setContent(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    getContentsByMaterialId();
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
        sx={{
          display: "flex",
          flexDirection: "column",
          m: 8,
          border: "1px solid black",
        }}
      >
        {content.map((c, idx) => {
          return (
            <>
              {idx !== 0 && idx !== content.length && (
                <Box
                  sx={{
                    mx: 4,
                    borderBottom: "4px solid #D9D9D9",
                    opacity: 0.5,
                  }}
                ></Box>
              )}
              <Box
                sx={{
                  p: 4,
                  width: "100",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    // width: { xs: "100%", md: "50%" },
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ReactPlayer
                    url={
                      c.video_url ||
                      "https://www.youtube.com/watch?v=XcQb07nwle4&list=RDXcQb07nwle4"
                    }
                  />
                </Box>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  // onClick={() => navigate("/courses/create")}
                  sx={{ m: 1, width: 50 }}
                >
                  Like
                </Button>
                <Typography sx={{ fontWeight: 700, fontSize: 40 }}>
                  {c.title}
                </Typography>
                <RichTextEditor
                  editable={false}
                  extensions={[StarterKit]}
                  content={c.body}
                />
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
            onClick={() => navigate(`/contents/create/${id}`)}
            sx={{ m: 1 }}
          >
            Tambah Konten
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default ContentByMaterialId;
