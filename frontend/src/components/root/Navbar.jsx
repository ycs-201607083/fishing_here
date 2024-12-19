import { useNavigate } from "react-router-dom";
import { Box, Center, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import mainTitle from "/src/components/Image/mainTitle.png";
import "../css/Modal.css";
import { MemberLogin } from "../../page/member/MemberLogin.jsx";

function NavItem({ children, ...rest }) {
  return (
    <Box
      whiteSpace="nowrap"
      _hover={{ textDecoration: "underline", cursor: "pointer" }}
      fontWeight={"bold"}
      {...rest}
    >
      {children}
    </Box>
  );
}

function TextItem({ children, ...rest }) {
  return (
    <Text
      css={{ color: "white" }}
      {...rest}
      _hover={{ textDecoration: "underline" }}
    >
      {children}
    </Text>
  );
}

export const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
export const openModal = () => setIsModalOpen(true);
export const closeModal = () => setIsModalOpen(false);

export function Navbar() {
  const navigate = useNavigate();

  const { id, kakaoId, isAdmin, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );

  return (
    <Box mb={5}>
      <Flex gap={5} h={"50px"} pt={2} pr={5}>
        <Spacer />
        {isAdmin && (
          <NavItem hideBelow={"sm"} onClick={() => navigate("manager/list")}>
            회원관리
          </NavItem>
        )}
        {isAuthenticated || (
          <NavItem onClick={() => navigate("/member/signup")}>회원가입</NavItem>
        )}
        {!isAuthenticated && <NavItem onClick={openModal}>로그인</NavItem>}

        {isAuthenticated && (
          <NavItem
            onClick={() => {
              navigate(`/member/${id}`);
            }}
          >
            <Text>{id} 님 환영합니다</Text>
          </NavItem>
        )}

        {isAuthenticated && (
          <NavItem
            onClick={() => {
              logout();
              closeModal();
              navigate("/board/list");
            }}
          >
            로그아웃
          </NavItem>
        )}
      </Flex>
      <Center
        alignItems="center"
        justifyContent="center"
        color={"blue.800"}
        fontSize={"40px"}
        h={"100px"}
        w={"100%"}
        _hover={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <Image src={mainTitle} />
      </Center>

      <Flex
        p={4}
        alignItems="center"
        justifyContent="center"
        bgColor={"blue.500"}
        w="100%"
      >
        <Flex gap={10} mx={"auto"}>
          <NavItem onClick={() => navigate("/board/announcement")}>
            <TextItem>공지사항</TextItem>
          </NavItem>
          <NavItem onClick={() => navigate("/board/map")}>
            <TextItem>낚시터 찾기</TextItem>
          </NavItem>
          <NavItem onClick={() => navigate("/board/list")}>
            <TextItem>커뮤니티</TextItem>
          </NavItem>
        </Flex>
      </Flex>
      {/* 로그인 모달 */}
      {isModalOpen && <MemberLogin closeModal={closeModal} />}
    </Box>
  );
}
