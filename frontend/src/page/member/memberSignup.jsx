import React, { useState } from "react";
import { Box, Group, Input, Span, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { PasswordInput } from "../../components/ui/password-input.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import DaumPostcodeEmbed from "react-daum-postcode";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import { useNavigate } from "react-router-dom";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

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
  const navigate = useNavigate();

  //유효성 체크 & 오류메시지
  const [idCheck, setIdCheck] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [birthMessage, setBirthMessage] = useState("");
  const [birthError, setBirthError] = useState(false);

  //우편번호api
  const [isOpen, setIsOpen] = useState(false);

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
      .then(() => {
        console.log("잘됨 성공");
        navigate("/");
      })
      .catch(() => {
        console.log("안됨 왜?");
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

  //이메일 정규식
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

  //비밀번호 확인
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

  //전화번호 정규식
  const phoneCheck = (e) => {
    const result = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
      .replace(/(-{1,2})$/g, "");
    setPhone(result);

    const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (!regPhone.test(result)) {
      setPhoneMessage("올바르지 않은 형식");
      setPhoneError(false);
    } else {
      setPhoneMessage("");
      setPhoneError(true);
    }
  };

  //생년월일 정규식
  const handleBirthCheck = (e) => {
    const value = e.target.value;
    const regBirth = /^([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))$/;
    setBirth(value);

    if (!regBirth.test(value)) {
      setBirthMessage("올바르지 않은 형식");
      setBirthError(false);
    } else {
      setBirthMessage("");
      setBirthError(true);
    }
  };

  // api
  const handleComplete = (e) => {
    const { address, zonecode } = e;
    setPost(zonecode);
    setAddress(address);
  };
  const handleClose = (e) => {
    if (e === "FORCE_CLOSE") {
      setIsOpen(false);
    } else if (e === "COMPLETE_CLOSE") {
      setIsOpen(false);
    }
  };

  let disabled = true;
  if (idCheck) {
    if (emailError && pwError) {
      disabled = false;
    }
  }

  return (
    <Box mx={"auto"} w={{ md: "500px" }}>
      <MyHeading>회원가입</MyHeading>
      <Stack gap={5} p="5" bg="blue.200">
        <Field label={"아이디"}>
          <Group attached>
            <Input
              value={id}
              onChange={(e) => {
                setIdCheck(false);
                setId(e.target.value);
              }}
              variant="subtle"
            />
            <Button onClick={handleIdCheckClick} colorPalette={"cyan"}>
              중복확인
            </Button>
          </Group>
        </Field>
        <Field label={"이메일"}>
          <Input
            value={email}
            onChange={handleEmailChange}
            variant="subtle"
            placeholder={"예) 12345@gmail.com"}
          />
          <Span style={{ color: emailError ? "green" : "red" }}>
            {emailMessage}
          </Span>
        </Field>
        <Field label={"비밀번호"}>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="subtle"
          />
        </Field>
        <Field label={"비밀번호 확인"}>
          <PasswordInput
            value={passwordCheck}
            onChange={handlePasswordCheck}
            variant="subtle"
          />
          <Span style={{ color: pwError ? "green" : "red" }}>{pwMessage}</Span>
        </Field>

        <Field label={"이름"}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="subtle"
          />
        </Field>

        <Field label={"전화번호"}>
          <Input
            value={phone}
            onChange={phoneCheck}
            variant="subtle"
            placeholder={" - 를 제외하고 입력하세요"}
          />
          <Span style={{ color: phoneError ? "green" : "red" }}>
            {phoneMessage}
          </Span>
        </Field>

        <Field label={"생년월일"}>
          <Input
            value={birth}
            onChange={handleBirthCheck}
            variant="subtle"
            placeholder={"예) 991230"}
          />
          <Span style={{ color: birthError ? "green" : "red" }}>
            {birthMessage}
          </Span>
        </Field>
        <Box>
          <Field label={"우편번호"}>
            <Group>
              <Input
                value={post}
                readOnly
                onChange={(e) => setPost(e.target.value)}
                variant="subtle"
              />
              <DialogRoot>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsOpen(true)}>우편번호 찾기</Button>
                </DialogTrigger>
                {isOpen && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>우편번호 검색</DialogTitle>
                    </DialogHeader>
                    <DialogBody pb="4">
                      <Field mt="5">
                        <DaumPostcodeEmbed
                          onComplete={handleComplete}
                          onClose={handleClose}
                        />
                      </Field>
                    </DialogBody>
                    <DialogFooter>
                      <DialogActionTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                        >
                          닫기
                        </Button>
                      </DialogActionTrigger>
                    </DialogFooter>
                  </DialogContent>
                )}
              </DialogRoot>
            </Group>
          </Field>
          <Field label={"상세주소"}>
            <Input
              value={address}
              readOnly
              onChange={(e) => setAddress(e.target.value)}
              variant="subtle"
            />
          </Field>
        </Box>
        <Box>
          <Button
            disabled={disabled}
            onClick={handleSaveClick}
            mx={"auto"}
            w={{ md: "100%" }}
            colorPalette={"blue"}
          >
            가입
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default MemberSignup;
