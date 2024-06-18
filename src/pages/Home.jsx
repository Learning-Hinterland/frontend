import React, { useCallback, useEffect, useState } from "react";
import Layout from "../layout";
import { Box, TextField, Typography } from "@mui/material";
import YoutubeEmbed from "../components/YoutubeEmbed";
import useDebounce from "../hooks/useDebounce";
import { API_URL } from "../constants";
import { useAuthStore } from "../store/auth";

function Home() {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const { token } = useAuthStore();

  const searchCourse = useCallback(async () => {
    const res = await fetch(`${API_URL}/courses?search=${search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("course search", json);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    searchCourse();
  }, [debouncedValue, searchCourse]);

  return (
    <Layout>
      <Box
        sx={{ paddingBlock: { xs: 1, md: 2 }, paddingInline: { xs: 2, md: 8 } }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 } }}>
          Jurusan Sekolah Hinterland
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: { xs: 2, md: 8 },
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <YoutubeEmbed embedId="yblwNDbZmqY" />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            onChange={(event) => {
              console.log("search coure", event.target.value);
              setSearch(event.target.value);
            }}
            variant="outlined"
            margin="normal"
            fullWidth
            id="search"
            label="Search courses"
            name="search"
            type="text"
            autoFocus
            sx={{ width: "50%" }}
          />
        </Box>
        <Box sx={{ borderBottom: "1px solid #000000", opacity: 0.25 }}></Box>

        <Typography
          sx={{ fontWeight: 700, fontSize: { xs: 18, md: 24 }, mt: 2 }}
        >
          Pemberitahuan
        </Typography>

        <ul>
          <li>
            <a href="/">Prosedur Pendaftaran siswa baru Sekolah Hinterland</a>
          </li>
          <li>
            <a href="/">Hasil Penerimaan siswa baru Sekolah Hinterland</a>
          </li>
        </ul>
      </Box>
    </Layout>
  );
}

export default Home;
