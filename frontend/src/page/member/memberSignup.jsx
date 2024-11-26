import React from "react";
import { Box, Field, Input, Stack } from "@chakra-ui/react";

function Filed() {
  return null;
}

function MemberSignup(props) {
  return (
    <Box>
      <h3>회원가입</h3>
      <Stack gap={5}>
        <Field label={"아이디"}>
          <Input />
        </Field>
        <Field label={"이메일"}>
          <Input />
        </Field>
        <Field label={"비밀번호"}>
          <Input />
        </Field>
        <Field label={"비밀번호 확인"}>
          <Input />
        </Field>
        <Field label={"전화번호"}>
          <Input />
        </Field>
      </Stack>
    </Box>
  );
}

export default MemberSignup;
