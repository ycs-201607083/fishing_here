import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const LoginKakaoHandler = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const a = import.meta.env.VITE_KAKAO_LOGIN_API_KEY;

  console.log(a);
  //인가코드 백으로 보내기
  useEffect(() => {}, []);
  return (
    <div>
      <p>로그인 중입니다.</p>
      <p>잠시만 기다려 주세요</p>
      <Spinner />
    </div>
  );
};

export default LoginKakaoHandler;
