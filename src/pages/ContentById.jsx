import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Layout from "../layout";
import { API_URL } from "../constants";
import { useAuthStore } from "../store/auth";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "mui-tiptap";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { ThumbDown } from "@mui/icons-material";
import Swal from "sweetalert2";

function ContentById() {
  const navigate = useNavigate();
  const { id, contentId } = useParams();
  const [course] = useState({});
  const [content, setContent] = useState({});
  const [discussion, setDiscussion] = React.useState({
    content: "",
  });
  const { token, data } = useAuthStore();
  console.log("id from param", id);
  console.log("contentId from param", contentId);

  const getContentById = async () => {
    const res = await fetch(`${API_URL}/contents/${contentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("get content by id ", json);
    setContent(json.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const sendLikeOrUnlike = async (data) => {
    const res = await fetch(`${API_URL}/contents/${contentId}/${data}`, {
      method: data === "like" ? "POST" : "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log(`send ${data} to content id `, json);
    if (json.status) getContentById();
  };

  const markWatch = async () => {
    try {
      const res = await fetch(`${API_URL}/contents/${id}/watch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      console.log(`mark as watch to content id `, json);
    } catch (error) {
      console.log("error mark as watch", error);
    }
  };

  const handleChangeDiscussion = (property, event) => {
    const contentCopy = { ...discussion };
    contentCopy[property] = event.target.value;

    setDiscussion(contentCopy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("createContent id", typeof id, id);
    console.log("create discussion", discussion);
    try {
      const response = await fetch(`${API_URL}/contents/${contentId}/comment`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discussion),
      });

      const json = await response.json();
      if (json.status) {
        Swal.fire("Berhasil mengirim diskusi", "", "success");
      } else {
        Swal.fire(`Gagal mengirim diskusi, ${json.message}`, "", "error");
      }
    } catch (error) {
        Swal.fire(`Gagal mengirim diskusi, ${error}`, "", "error");
    } finally {
      setDiscussion({ content: "" });
      getContentById();
    }
  };

  const getDeadline = (deadline) => {
    return `${new Date(deadline).getDate()}-${new Date(
      deadline
    ).getMonth()}-${new Date(deadline).getFullYear()} ${new Date(
      deadline
    ).getHours()}:${new Date(deadline).getMinutes()}`;
  };

  const deleteContent = async (e) => {
    e.preventDefault();
    console.log("delete content", content);
    const response = await fetch(`${API_URL}/contents/${contentId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    return json;
  };

  useEffect(() => {
    getContentById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timeout;

    timeout = setTimeout(() => markWatch(), 5000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
        onClick={() => navigate(-1)}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          {course && course.name ? course.name : "Content Detail"}
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
        <>
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
                  content.video_url ||
                  "https://www.youtube.com/watch?v=XcQb07nwle4&list=RDXcQb07nwle4"
                }
              />
            </Box>
            <Box
              mt={2}
              p={2}
              border={"1px solid #D5D5D5"}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
            >
              <Typography color={"InfoText"}>
                Liked by: {content.likes_count} person
              </Typography>
              <IconButton
                type="button"
                variant="contained"
                color={content.likes ? "error" : "primary"}
                onClick={async () => {
                  if (content.likes) await sendLikeOrUnlike("unlike");
                  if (!content.likes) await sendLikeOrUnlike("like");
                }}
                sx={{ m: 1, width: 50 }}
              >
                {content.likes ? <ThumbDown /> : <ThumbUpIcon />}
              </IconButton>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 40 }}>
              {content.title}
            </Typography>
            {content?.body && (
              <RichTextEditor
                editable={false}
                extensions={[StarterKit]}
                content={`<p>${content?.body}</p>`}
              />
            )}
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
                onClick={() => navigate(`/contents/edit/${contentId}`)}
                sx={{ m: 1 }}
              >
                Edit Konten
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  Swal.fire({
                    title: `Do you want to delete content ${content?.title}?`,
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    denyButtonText: `Don't delete`,
                  }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      try {
                        const result = await deleteContent();
                        if (result.status)
                          Swal.fire("Konten Berhasil di delete", "", "success");
                        if (!result.status)
                          Swal.fire("Konten Gagal di delete", "", "error");
                      } catch (error) {
                        Swal.fire(error.message, "", "error");
                      }
                    }
                    if (result.isDenied) {
                      Swal.fire("Changes are not saved", "", "info");
                    }
                  })
                }
              >
                Delete Konten
              </Button>
            </Box>
          )}
          <Box
            sx={{
              p: 4,
              // display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
            }}
          >
            <Box
              sx={{
                paddingBlock: { xs: 1, md: 2 },
                paddingInline: { xs: 2, md: 2 },
              }}
            >
              <Typography
                sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}
              >
                Diskusi
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 6,
                }}
              >
                {content?.comments?.map((c, cIdx) => {
                  return (
                    <Box key={`chat-${cIdx}`} width={"100%"}>
                      <Typography
                        sx={{ fontWeight: 700, fontSize: { xs: 10, md: 14 } }}
                      >
                        {c.content}
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 400, fontSize: { xs: 10, md: 14 } }}
                      >
                        {getDeadline(c.date)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Box
                sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}
              ></Box>
              <form noValidate>
                <TextField
                  onChange={(event) => handleChangeDiscussion("content", event)}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="content"
                  label="Content"
                  name="content"
                  type="text"
                  autoFocus
                />
                <Button
                  disabled={discussion.content === ""}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 4 }}
                  onClick={onSubmit}
                >
                  Kirim Diskusi
                </Button>
              </form>
            </Box>
          </Box>
        </>
      </Box>
    </Layout>
  );
}

export default ContentById;
