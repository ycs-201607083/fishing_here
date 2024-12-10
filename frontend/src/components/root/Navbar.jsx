import { useNavigate } from "react-router-dom";
import { Box, Center, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import mainTitle from "/src/components/Image/mainTitle.png";

function NavItem({ children, ...rest }) {
  return (
    <Box whiteSpace="nowrap" {...rest}>
      {children}
    </Box>
  );
}

export function Navbar() {
  const navigate = useNavigate();

  const { id, kakaoId, isAdmin, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );

  return (
    <Box mb={5}>
      <Center
        color={"blue.800"}
        fontSize={"40px"}
        h={"100px"}
        w={"100%"}
        onClick={() => navigate("/")}
      >
        <Image src={mainTitle} />
      </Center>

      <Flex p={4} justify="center" bgColor={"blue.500"} w="100%">
        <Spacer />
        <Flex gap={10}>
          <NavItem onClick={() => navigate("/board/announcement")}>
            공지사항
          </NavItem>
          <NavItem onClick={() => navigate("/board/map")}>낚시터찾기</NavItem>
          <NavItem onClick={() => navigate("/board/list")}>커뮤니티</NavItem>
        </Flex>
        <Spacer />
        <Flex gap={5}>
          {isAdmin && (
            <NavItem hideBelow={"sm"} onClick={() => navigate("manager/list")}>
              회원관리
            </NavItem>
          )}
          {isAuthenticated || (
            <NavItem onClick={() => navigate("/member/signup")}>
              회원가입
            </NavItem>
          )}
          {isAuthenticated || (
            <NavItem onClick={() => navigate("member/login")}>로그인</NavItem>
          )}

          {isAuthenticated && (
            <NavItem
              onClick={() => {
                logout();
                navigate(`/member/${id}`);
              }}
            >
              <Text>{id}</Text>
            </NavItem>
          )}

          {isAuthenticated && (
            <NavItem
              onClick={() => {
                logout();
                navigate("/member/login");
              }}
            >
              로그아웃
            </NavItem>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
