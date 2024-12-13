import { Box, Button, Input, Spinner, Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
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
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

export function MemberInfo() {
  const [member, setMember] = useState(null);
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { hasAccess } = useContext(AuthenticationContext);

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
    <Box px="20px" mx={"auto"} w={{ md: "500px" }}>
      <h3>회원 정보</h3>
      <Stack gap={5} p="5" bg="blue.200">
        <Field label={"아이디"}>
          <Input
            readOnly
            value={member.id}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"암호"}>
          <Input
            readOnly
            value={member.password}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"이름"}>
          <Input
            readOnly
            value={member.name}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"이메일"}>
          <Input
            readOnly
            value={member.email}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"번호"}>
          <Input
            readOnly
            value={member.phone}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"생일"}>
          <Input
            readOnly
            value={member.birth}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"우편번호"}>
          <Input
            readOnly
            value={member.post}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"주소"}>
          <Input
            readOnly
            value={member.address}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"가입일시"}>
          <Input
            readOnly
            value={member.inserted}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Box>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <div>
                <Box>
                  <Button
                    colorPalette={"blue"}
                    onClick={() => navigate(`/member/edit/${id}`)}
                    mx={"auto"}
                    w={{ md: "100%" }}
                  >
                    수정
                  </Button>
                </Box>
                <Box>
                  <Button
                    colorPalette={"blue"}
                    onClick={() => navigate(`/board/written/${id}`)}
                    mx={"auto"}
                    w={{ md: "100%" }}
                  >
                    내 작성글
                  </Button>
                </Box>
                <Box>
                  <Button
                    colorPalette={"orange"}
                    mx={"auto"}
                    w={{ md: "100%" }}
                  >
                    탈퇴
                  </Button>
                </Box>
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
