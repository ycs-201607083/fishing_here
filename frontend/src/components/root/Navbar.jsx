import { useNavigate } from "react-router-dom";
import { Box, Center, Flex, Spacer } from "@chakra-ui/react";

function NavItem({ children, ...rest }) {
  return (
    <Box whiteSpace="nowrap" {...rest}>
      {children}
    </Box>
  );
}

export function Navbar() {
  const navigate = useNavigate();

  const menuStyle = {};

  return (
    <Box>
      <Center
        color={"blue.800"}
        fontSize={"40px"}
        h={"100px"}
        w={"100%"}
        onClick={() => navigate("/")}
        fontFamily={"SANGJU Gotgam"}
      >
        자리요
      </Center>
      <Flex p={4} justify="center" bgColor={"blue.500"} w="100%">
        <Spacer />
        <Flex gap={5}>
          <NavItem onClick={() => navigate("/board/map")}>낚시터찾기</NavItem>
          <NavItem {...menuStyle} onClick={() => navigate("/board/list")}>
            커뮤니티
          </NavItem>
        </Flex>
        <Spacer />
        <Flex gap={5}>
          <NavItem {...menuStyle} hideBelow={"sm"}>
            회원관리
          </NavItem>
          <NavItem {...menuStyle} onClick={() => navigate("/member/signup")}>
            회원가입
          </NavItem>
          <NavItem {...menuStyle} onClick={() => navigate("member/login")}>
            로그인
          </NavItem>
          <NavItem {...menuStyle}>로그아웃</NavItem>
        </Flex>
      </Flex>
    </Box>
  );
}
