import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Input, Spinner, Textarea } from "@chakra-ui/react";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import { Field } from "../../components/ui/field.jsx";

export function BoardAnnouncementView() {
  const { id } = useParams();
  const [annView, setAnnView] = useState(null);

  useEffect(() => {
    axios.get(`/api/board/viewAnn/${id}`).then((res) => {
      setAnnView(res.data);
    });
  }, []);

  if (annView === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <MyHeading>게시글 수정</MyHeading>
      <Field label="제목">
        <Input value={annView.title} />
      </Field>
      <Field label="본문">
        <Textarea value={annView.title} />
      </Field>
    </Box>
  );
}

export default BoardAnnouncementView;
