import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { Spinner } from "@chakra-ui/react";

export function KaKaoLogin() {
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) {
      console.error("인가코드 없음");
      return;
    }

    const fetchToken = async () => {
      try {
        // 1. 카카오 서버로부터 엑세스 토큰 받기
        const response = await axios.get(`/api/oauth/kakao?code=${code}`, {
          headers: { "Content-Type": "application/json;charset=utf-8" },
        });

        const { kakaoToken, email, id, nickName } = response.data;
        if (!kakaoToken || typeof kakaoToken !== "string") {
          console.error("유효하지 않은 카카오 토큰:", kakaoToken);
          return;
        }

        if (kakaoToken) {
          // 2. 백엔드로 카카오 토큰 전달하여 JWT 발급 요청
          const jwtResponse = await axios.post("/api/oauth/kakao", {
            kakaoToken,
            email,
            id,
            nickName,
          });

          const { jwtToken } = jwtResponse.data; // 백엔드에서 반환된 JWT

          if (jwtToken) {
            // 3. 기존 로그인 시스템에 JWT 저장
            authentication.login(jwtToken);

            // 4. 사용자 홈으로 리다이렉트
            toaster.create({
              type: "success",
              description: "로그인 성공",
            });
            navigate("/");
          } else {
            console.error("JWT 발급 실패");
          }
        }
      } catch (error) {
        console.error("카카오 로그인 처리 실패:", error);
      }
    };

    fetchToken();
  }, [authentication, navigate]);

  return (
    <div>
      카카오 로그인 중 입니다.
      <Spinner />
    </div>
  );
}
