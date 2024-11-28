import React, { useContext, useState } from "react";
import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { useNavigate } from "react-router-dom";

export function MemberLogin(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const authentication = useContext(AuthenticationContext);
  const REST_API_KEY = import.meta.env.VITE_KAKAO_LOGIN_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URL;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  /* const url = new URL(window.location.href);
   const code = url.searchParams.get("code");
   useEffect(() => {
     axios.get(`${REDIRECT_URI}kakaoLogin${code}`).then((r) => {
       console.log(r.data);
       localStorage.setItem("name", r.data.user_name);

       navigate("/member/login");
     });
   }, []);

 useEffect(() => {
   try {
     const code = new URL(window.location.href).searchParams.get("code");
     console.log("code : " + code);
     if (code) {
       axios
         .get(`http://localhost:5173/auth?code=${code}`)
         .then((response) => {
           console.log("Success:", response.data);
         })
         .catch((error) => {
           console.error("Error:", error);
         });
     } else {
       console.error("No code parameter found in URL");
     }
   } catch (err) {
     console.error("Unexpected error in AuthHandler:", err);
   }
 }, []);*/

  function handleLoginClick() {
    axios
      .post("/api/member/login", { id, password })
      .then((res) => res.data)
      .then((data) => {
        // 토스트 띄우고
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        // login
        console.log("token? = ", data.token);
        authentication.login(data.token);
        navigate("/loginSuccess");
      })
      .catch((e) => {
        const message = e.response.data.message;
        // 토스트 띄우고
        toaster.create({
          type: message.type,
          description: message.text,
        });
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
          <Button onClick={handleLoginClick} w={"28%"} justify={"center"}>
            로그인
          </Button>
          <button onClick={handleLogin}>
            <img src={"/kakao_login_m.png"} alt={"카카오 로그인"} />
          </button>
        </Flex>
      </Stack>
    </Box>
  );
}
