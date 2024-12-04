import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

export const LoginKakaoHandler = (props) => {
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URL;
  const code = new URL(window.location.href).searchParams.get("code");
  const authentication = useContext(AuthenticationContext);
  const navigate = useNavigate();


  //인가코드 백으로 보내기
  useEffect(() => {
    const kakaoLogin = async () => {
      try {
        const response = await axios.get(`/api/oauth/kakao?code=${code}`, {
          headers: { "Content-Type": "application/json;charset=utf-8" },
        });

        //받은 토큰과 사용자 정보
        // const { token, userInfo } = respone.data;
        const { token } = response.data;
        console.log("data = ", response.data);
        if (token) {
          console.log("token! = ", token);
          localStorage.setItem("kakaoToken", token);
          //인증 상태 업데이트
          authentication.kakaoLogin(token);
          // 로그인 성공 시 이동 페이지
          navigate("/");
        } else {
          console.log("non token!");
        }
      } catch (e) {
        console.log("로그인 실패", e);
      }
    };
    kakaoLogin();
  }, []);

  return (
    <div>
      <p>로그인 중입니다.</p>
      <p>잠시만 기다려 주세요</p>
      <Spinner />
    </div>
  );
};

export default LoginKakaoHandler;
