import React, { useContext, useState } from "react";
import { Box, Flex, HStack, IconButton, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { useNavigate } from "react-router-dom";
import "../../components/css/Modal.css";
import { CloseButton } from "../../components/ui/close-button";

export function MemberLogin({ closeModal }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const authentication = useContext(AuthenticationContext);
  const REST_API_KEY = import.meta.env.VITE_KAKAO_LOGIN_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URL;
  const navigate = useNavigate();
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&account_email`;

  const handleLogin = () => {
    window.location.href = kakaoURL;
    console.log("MemberLogin:", window.location.href); // 현재 URL 확인
  };

  function handleLoginClick() {
    axios
      .post("/api/member/login", { id, password })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        authentication.login(data.token);
        closeModal();
        navigate("/");
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally();
  }

  const ClickSignupPage = () => {
    closeModal();
    navigate("/member/signup");
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        <Box>
          <HStack justifyContent="center" width="100%">
            <h3>로그인</h3>
            <CloseButton
              position="absolute"
              top="10px"
              right="10px"
              variant={"ghost"}
              colorPalette={"blue"}
              onClick={closeModal}
            />
          </HStack>
          <Stack>
            <Field label="아이디">
              <Input
                variant="flushed"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </Field>
            <Field label="암호">
              <Input
                variant="flushed"
                type={"password"}
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
              <Button size="xs" variant={"ghost"} onClick={ClickSignupPage}>
                회원가입 바로가기
              </Button>
              <Button onClick={handleLoginClick} w={"53%"} justify={"center"}>
                로그인
              </Button>
              <IconButton
                onClick={handleLogin}
                colorPalette={"white"}
                variant={"ghost"}
                size={"sx"}
              >
                <img src={"/kakao_login_m.png"} alt={"카카오 로그인"} />
              </IconButton>
            </Flex>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
