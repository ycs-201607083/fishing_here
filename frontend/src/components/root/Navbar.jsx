import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <Flex gap={5}>
      <Box onClick={() => navigate("/")}>메인</Box>
      <Box>중고입찰</Box>
      <Box>커뮤니티</Box>
      <Box onClick={() => navigate("/member/signup")}>회원가입</Box>
      <Box>로그인</Box>
    </Flex>
  );
}
