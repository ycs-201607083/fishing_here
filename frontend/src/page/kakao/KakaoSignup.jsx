import "../../components/css/Modal.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Group, HStack, Input, Stack } from "@chakra-ui/react";
import { CloseButton } from "../../components/ui/close-button";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";

export function KakaoSignup() {
  const [id, setId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idCheck, setIdCheck] = useState(false);

  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get("code");

  const handleKakaoIdCheckClick = async () => {
    try {
      const response = await axios.get("/api/member/check", {
        params: { id },
      });

      const { message, available } = response.data;
      toaster.create({
        type: message.type,
        description: message.text,
      });
      setIdCheck(available);
    } catch (error) {
      console.error("Failed to check ID:", error);
    }
  };

  const handleSaveClick = async () => {
    try {
      await axios.post("/api/member/kakao/signup", {
        id: id,
        email: email,
        password: "kakaoPassword",
        phone: "kakaoPhone",
        name: name,
        birth: "kakaoBirth",
        post: 13529,
        address: "kakaoCompany",
      });
      console.log("Signup successful");
      console.log("code =", code);
      console.log("kakaoSignUp:", window.location.href); // 현재 URL 확인
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent click propagation
      >
        <Box>
          <HStack justifyContent="center" width="100%">
            <h3>카카오 회원가입</h3>
            <CloseButton
              position="absolute"
              top="10px"
              right="10px"
              variant="ghost"
              colorPalette="blue"
              onClick={() => setIsModalOpen(false)}
            />
          </HStack>
          <Stack>
            <Field label={"사용하실 닉네임을 설정 해주시기 바랍니다."}>
              <Group w="100%" attached>
                <Input
                  value={id}
                  onChange={(e) => {
                    setIdCheck(false);
                    setId(e.target.value);
                  }}
                  variant="subtle"
                />
                <Button onClick={handleKakaoIdCheckClick} colorPalette="cyan">
                  중복확인
                </Button>
              </Group>
            </Field>

            <Button
              disabled={!idCheck}
              onClick={handleSaveClick}
              mx="auto"
              w="100%"
              colorPalette="blue"
            >
              가입
            </Button>
          </Stack>
        </Box>
      </div>
    </div>
  );
}

export default KakaoSignup;
