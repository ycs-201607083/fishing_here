import React, { useState } from "react";
import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";

export function MemberLogin(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function handleLoginClick() {
    axios
      .post("/api/member/login", {
        id,
        password,
      })
      .then((res) => res.data)
      .catch((e) => {
        console.log("ㄴㄴ");
      })
      .finally();
  }

  return (
    <Box>
      <h3>로그인</h3>
      <Stack>
        <Field label="아이디">
          <Input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </Field>
        <Field label="암호">
          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Field>
        <Flex
          align="center"
          justify="center"
          direction="column" // 버튼을 수직으로 배치
          wrap="wrap" // 화면 크기에 맞춰 버튼들이 줄바꿈 가능하도록
          gap={4} // 버튼들 사이에 간격 추가>
        >
          <Button onClick={handleLoginClick} w={"30%"} justify={"center"}>
            로그인
          </Button>
          <Button w={"30%"} justify={"center"}>
            카카오 로그인
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}
