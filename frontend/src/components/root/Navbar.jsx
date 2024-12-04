import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <Flex gap={5}>
      <Box onClick={() => navigate("/")}>메인</Box>
      <Box onClick={() => navigate("/board/map")}>지도검색</Box>
      <Box onClick={() => navigate("/board/list")}>커뮤니티</Box>
      <Box onClick={() => navigate("/member/signup")}>회원가입</Box>
      <Box onClick={() => navigate("member/login")}>로그인</Box>
    </Flex>
  );
}
