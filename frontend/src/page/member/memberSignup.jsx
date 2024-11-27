import React, { useState } from "react";
import { Box, Group, Input, Span, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { PasswordInput } from "../../components/ui/password-input.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";

export function MemberSignup() {
  //데이터 입력
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [post, setPost] = useState("");
  const [address, setAddress] = useState("");

  //유효성 체크 & 오류메시지
  const [idCheck, setIdCheck] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState(false);

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

  const handleIdCheckClick = () => {
    axios
      .get("/api/member/check", { params: { id: id } })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setIdCheck(data.available);
      });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{3}$/i;

    if (!emailRegex.test(value)) {
      setEmailError(false);
      setEmailMessage("유효하지 않은 이메일 형식입니다");
    } else {
      setEmailError(true);
      setEmailMessage("올바른 이메일 형식입니다.");
    }
  };

  const handlePasswordCheck = (e) => {
    const value = e.target.value;
    setPasswordCheck(value);

    if (password === value) {
      setPwError(true);
      setPwMessage("비밀번호가 일치합니다.");
    } else {
      setPwError(false);
      setPwMessage("비밀번호가 일치하지 않습니다.");
    }
  };

  let disabled = true;
  if (idCheck) {
    if (emailError && pwError) {
      disabled = false;
    }
  }

  return (
    <Box>
      <h3>회원가입</h3>
      <Stack gap={5}>
        <Field label={"아이디"}>
          <Group attached>
            <Input
              value={id}
              onChange={(e) => {
                setIdCheck(false);
                setId(e.target.value);
              }}
            />
            <Button onClick={handleIdCheckClick} variant={"outline"}>
              중복확인
            </Button>
          </Group>
        </Field>
        <Field label={"이메일"}>
          <Input value={email} onChange={handleEmailChange} />
          <Span style={{ color: emailError ? "green" : "red" }}>
            {emailMessage}
          </Span>
        </Field>
        <Field label={"비밀번호"}>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label={"비밀번호 확인"}>
          <PasswordInput value={passwordCheck} onChange={handlePasswordCheck} />
          <Span style={{ color: pwError ? "green" : "red" }}>{pwMessage}</Span>
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
          <Button disabled={disabled} onClick={handleSaveClick}>
            가입
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default MemberSignup;
