import { Box, Flex, Table, TableRoot } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyHeading } from "../../components/root/MyHeading.jsx";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/api/member/list").then((res) => setMemberList(res.data));
  }, []);

  //테이블 행 클릭 시 회원정보 보기로 이동
  function handleRowClick(id) {
    navigate(`/member/${id}`);
    console.log("id = ", id);
  }

  if (!memberList || memberList.length === 0) {
    return <h3>회원 목록이 존재하지 않습니다.</h3>;
  }
  return (
      <Flex
        wrap="wrap" // 공간이 부족할 때 다음 줄로 넘어감
        p="4" // 패딩
        bg="gray.100"
        w={"100%"}
        h={"90vh"}>

        <Flex direction="column" w="100%" h="40%">
          <MyHeading>회원 목록</MyHeading>
        <Box
          w="100%"
          h="100%"
          overflow="auto" // 스크롤 활성화
          border="1px solid"
          borderColor="gray.300"
          p="4"
        >
          <TableRoot interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>아이디</Table.ColumnHeader>
                <Table.ColumnHeader>이메일</Table.ColumnHeader>
                <Table.ColumnHeader>가입일시</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {memberList.map((member) => (
                <Table.Row
                  omClick={() => handleRowClick(member.id)}
                  key={member.id}
                >
                  <Table.Cell>{member.id}</Table.Cell>
                  <Table.Cell>{member.email}</Table.Cell>
                  <Table.Cell>{member.inserted}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </TableRoot>
        </Box>
        </Flex>

        <Flex direction="column" w="100%" h="40%">
          <MyHeading>게시글 목록</MyHeading>
          <Box
            w="100%"
            h="100%"
            overflow="auto" // 스크롤 활성화
            border="1px solid"
            borderColor="gray.300"
            p="4"
          >
            <TableRoot interactive>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>아이디</Table.ColumnHeader>
                  <Table.ColumnHeader>이메일</Table.ColumnHeader>
                  <Table.ColumnHeader>가입일시</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {memberList.map((member) => (
                  <Table.Row
                    omClick={() => handleRowClick(member.id)}
                    key={member.id}
                  >
                    <Table.Cell>{member.id}</Table.Cell>
                    <Table.Cell>{member.email}</Table.Cell>
                    <Table.Cell>{member.inserted}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </TableRoot>
          </Box>
        </Flex>
      </Flex>

  );
}
