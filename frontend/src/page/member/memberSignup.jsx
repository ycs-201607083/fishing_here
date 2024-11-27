import React, { useState } from "react";
import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [post, setPost] = useState("");
  const [address, setAddress] = useState("");

  function handleSaveClick() {
    axios
      .post("/api/member/signup", {
        id,
        email,
        password,
        phone,
        name,
        birth,
        post,
        address,
      })
      .then((res) => {
        console.log("잘됨");
      })
      .catch((e) => {
        console.log("안됨");
      });
  }

  return (
    <Box>
      <h3>회원가입</h3>
      <Stack gap={5}>
        <Field label={"아이디"}>
          <Input value={id} onChange={(e) => setId(e.target.value)} />
        </Field>
        <Field label={"이메일"}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label={"비밀번호"}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label={"비밀번호 확인"}>
          <Input
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </Field>
        <Field label={"전화번호"}>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label={"이름"}>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={"생년월일"}>
          <Input value={birth} onChange={(e) => setBirth(e.target.value)} />
        </Field>
        <Field label={"우편번호"}>
          <Input value={post} onChange={(e) => setPost(e.target.value)} />
        </Field>
        <Field label={"상세주소"}>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>
        <Box>
          <Button onClick={handleSaveClick}>가입</Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default MemberSignup;
