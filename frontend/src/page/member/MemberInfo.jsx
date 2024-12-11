import { Box, Button, Input, Spinner, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export function MemberInfo() {
  const [member, setMember] = useState(null);
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //회원정보 얻기
    axios.get(`/api/member/${id}`).then((res) => setMember(res.data));
  }, []);

  function handleDeleteClick() {
    axios
      .delete("/api/member/remove", {
        data: { id, password },
      })
      .then((res) => {
        const message = res.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate("/member/signup");
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
        setPassword("");
      });
  }

  if (!member) {
    return <Spinner />;
  }

  return (
    <Box>
      <h3>회원 정보</h3>
      <Stack gap={5}>
        <Field label={"아이디"}>
          <Input readOnly value={member.id} />
        </Field>
        <Field label={"암호"}>
          <Input readOnly value={member.password} />
        </Field>
        <Field label={"이름"}>
          <Input readOnly value={member.name} />
        </Field>
        <Field label={"이메일"}>
          <Input readOnly value={member.email} />
        </Field>
        <Field label={"번호"}>
          <Input readOnly value={member.phone} />
        </Field>
        <Field label={"생일"}>
          <Input readOnly value={member.birth} />
        </Field>
        <Field label={"우편번호"}>
          <Input readOnly value={member.post} />
        </Field>
        <Field label={"주소"}>
          <Input readOnly value={member.address} />
        </Field>
        <Field label={"가입일시"}>
          <Input readOnly value={member.inserted} />
        </Field>
        <Box>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <div>
                <Button colorScheme={"orange"}>탈퇴</Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>탈퇴확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p>탈퇴 하시겠습니까?</p>
                <p
                  style={{
                    fontSize: "0.8em",
                    color: "gray",
                    marginTop: "0.5em",
                  }}
                >
                  비밀번호 입력 시 탈퇴가 완료됩니다.
                </p>
                <Stack gap={5}>
                  <Field>
                    <Input
                      placeholder={"비밀번호를 입력해주세요."}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <Button colorScheme={"orange"} onClick={handleDeleteClick}>
                  탈퇴
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Stack>
    </Box>
  );
}
