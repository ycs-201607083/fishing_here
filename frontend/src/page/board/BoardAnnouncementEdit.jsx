import React, { useEffect, useState } from "react";
import { Box, Input, Spinner, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

function ImageView({ files, onRemoveSwitchClick }) {
  return <Box>{files.map((files) => {})}</Box>;
}

export function BoardAnnouncementEdit() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/board/viewAnn/${id}`)
      .then((res) => {
        setAnnouncement(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveClick = () => {
    // axios.putForm("api/board/updateAnn", {
    //   id: announcement.id,
    //   title: announcement.title,
    //   content: announcement.content,
    // });
  };

  if (loading) {
    return <Spinner></Spinner>;
  }

  let handleSwitchClick;
  return (
    <Box maxW={"70%"} mx={"auto"}>
      <Stack gap={5}>
        <Field label="제목">
          <Input
            value={announcement.title}
            placeholder="제목을 입력해 주세요"
            onChange={(e) =>
              setAnnouncement({ ...announcement, title: e.target.value })
            }
          />
        </Field>
        <Field label="본문">
          <Textarea
            value={announcement.content}
            placeholder="내용을 입력해 주세요"
            h={"300px"}
            onChange={(e) =>
              setAnnouncement({ ...announcement, content: e.target.value })
            }
          />

          <ImageView
            files={announcement.files}
            onRemoveSwitchClick={handleSwitchClick}
          />
        </Field>
      </Stack>
    </Box>
  );
}

export default BoardAnnouncementEdit;
