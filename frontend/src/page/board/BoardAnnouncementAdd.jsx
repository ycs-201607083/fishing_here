import React from "react";
import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";

export function BoardAnnouncementAdd() {
  return (
    <Box>
      <Stack>
        <Field label={"제목"}>
          <Input />
        </Field>
        <Field label={"본문"}>
          <Input />
        </Field>
        <Field>
          <Input />
        </Field>
      </Stack>
    </Box>
  );
}

export default BoardAnnouncementAdd;
