import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout";
import { API_URL } from "../constants";
import { useAuthStore } from "../store/auth";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "mui-tiptap";
function Contents() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course] = useState({});
  const [content, setContent] = useState([]);
  const [materials, setMaterials] = useState({});
  const { token, data } = useAuthStore();
  console.log("id from param", id);

  const getDeadline = (deadline) => {
    return `${new Date(deadline).getDate()}-${new Date(
      deadline
    ).getMonth()}-${new Date(deadline).getFullYear()} ${new Date(
      deadline
    ).getHours()}:${new Date(deadline).getMinutes()}`;
  };

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

  const getMaterialById = async () => {
    const res = await fetch(`${API_URL}/materials/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get material by material id ", json);
    setMaterials(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    getContentsByMaterialId();
    getMaterialById();
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
                component={"div"}
                sx={{
                  p: 4,
                  width: "100",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                onClick={() => navigate(`/contents/${id}/detail/${c.id}`)}
              >
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
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
        onClick={() => navigate(-1)}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          Tugas
        </Typography>
      </Box>
      {materials?.is_having_assignment && (
        <Box
          sx={{
            paddingBlock: { xs: 1, md: 2 },
            paddingInline: { xs: 2, md: 8 },
          }}
            onClick={() => navigate(`/assignment/details/${materials.id}`)}
        >
          <Box sx={{ border: "1px solid #D5D5D5", p: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
              {materials.assignment.content}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}>
              Deadline: {getDeadline(materials.assignment.deadline)}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}>
              Siswa: {materials.assignment.student_count}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}>
              Siswa yang sudah mengumpulkan: {materials.assignment.student_submission_count}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 16, md: 20 } }}>
              Progress: {materials.assignment.submission_progress}%
            </Typography>
          </Box>
        </Box>
      )}

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
            onClick={() => navigate(`/assignment/create/${materials.id}`)}
            sx={{ m: 1 }}
          >
            Tambah Tugas
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Contents;
