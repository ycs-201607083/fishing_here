import React, { useState } from "react";
import { Box, Input } from "@chakra-ui/react";

import { Field } from "../../components/ui/field.jsx";

export function BoardAnnouncementAdd() {
  const [content, setContent] = useState("");

  return (
    <Box>
      <Field label="제목">
        <Input placeholder="제목을 입력해 주세요" />
      </Field>
      <Box>
        <ReactQuill></ReactQuill>
      </Box>
    </Box>
  );
}

export default BoardAnnouncementAdd;
