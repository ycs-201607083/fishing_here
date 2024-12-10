import React, { useState } from "react";
import { Box, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

export function BoardAnnouncementAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSaveButton = () => {
    axios
      .post("/api/board/annAdd", { title, content })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({ type: message.type, description: message.text });
        navigate(`/board/announcement`);
      })
      .catch((e) => {
        const message = e.response.message;
        toaster.create({ type: message.type, description: message.text });
      });
  };

  return (
    <Box>
      <Field label="제목">
        <Input
          value={title}
          placeholder="제목을 입력해 주세요"
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>
      <Field label="본문">
        <Textarea
          value={content}
          placeholder="내용을 입력해 주세요"
          onChange={(e) => setContent(e.target.value)}
        />
      </Field>
      <Button onClick={handleSaveButton}>저장</Button>
    </Box>
  );
}

export default BoardAnnouncementAdd;
