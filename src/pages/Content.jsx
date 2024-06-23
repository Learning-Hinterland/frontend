import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Layout from "../layout";
import { API_URL } from "../constants";
import { useAuthStore } from "../store/auth";

function ContentByMaterialId() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [content, setContent] = useState([]);
  const { token } = useAuthStore();
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
              <Box sx={{ p: 4 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                  {c.title}
                </Typography>
                <Typography sx={{ fontWeight: 400, fontSize: 12 }}>
                  {c.body}
                </Typography>
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                  <ReactPlayer
                    url={
                      c.video_url ||
                      "https://www.youtube.com/watch?v=XcQb07nwle4&list=RDXcQb07nwle4"
                    }
                  />
                </Box>
              </Box>
            </>
          );
        })}
      </Box>
    </Layout>
  );
}

export default ContentByMaterialId;
