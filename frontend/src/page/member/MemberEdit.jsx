import { Box, Button, Input, Span, Spinner, Stack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

export function MemberEdit() {
  const { id } = useParams();
  // 데이터 받기
  const [member, setMember] = useState(null);
  // 수정 대상 데이터
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [post, setPost] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  // 수정시 비밀번호 수정
  const [oldPassword, setOldPassword] = useState("");
  // 조건 만족시 open
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // 이메일 오류 상태
  const [emailError, setEmailError] = useState(false);
  // 이메일 메시지 상태
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    axios.get(`/api/member/${id}`).then((res) => {
      setMember(res.data);
      setPassword(res.data.password);
      setPost(res.data.post);
      setPhone(res.data.phone);
      setAddress(res.data.address);
      setEmail(res.data.email);
    });
  }, []);

  // 수정 버튼 클릭시 업데이트 + 토스터
  function handleSaveClick() {
    axios
      .put("/api/member/update", {
        id: member.id,
        password,
        post,
        address,
        email,
        oldPassword,
      })
      .then((res) => {
        const message = res.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/member/${id}`);
      })
      .catch((e) => {
        const message = e.response.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setOpen(false);
        setOldPassword("");
      });
  }

  //로딩
  if (member === null) {
    return <Spinner />;
  }

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

  return (
    <Box>
      <h3>회원 정보</h3>
      <Stack gap={5}>
        <Field readOnly label={"아이디"}>
          <Input readOnly defaultValue={member.id} style={{ color: "gray" }} />
        </Field>
        <Field label={"암호"}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field readOnly label={"이름"}>
          <Input readOnly style={{ color: "gray" }} value={member.name} />
        </Field>
        <Field label={"이메일"}>
          <Input value={email} onChange={handleEmailChange} />
          <Span style={{ color: emailError ? "green" : "red" }}>
            {emailMessage}
          </Span>
        </Field>
        <Field label={"번호"}>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field readOnly label={"생일"}>
          <Input readOnly value={member.birth} style={{ color: "gray" }} />
        </Field>
        <Field label={"우편번호"}>
          <Input readOnly value={member.post} />
        </Field>
        <Field label={"주소"}>
          <Input readOnly value={member.address} />
        </Field>
        <Field readOnly label={"가입일시"}>
          <Input
            defaultValue={member.id}
            style={{ color: "gray" }}
            value={member.inserted}
          />
        </Field>
        <Box>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <Button colorPalette={"blue"}>저장</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>회원 정보 변경 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack gap={5}>
                  <Field label={"기존 암호"}>
                    <Input
                      placeholder={"기존 암호를 입력해주세요."}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </Field>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <Button colorPalette={"blue"} onClick={handleSaveClick}>
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Stack>
    </Box>
  );
}
