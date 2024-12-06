import { Box, Flex, Table, TableRoot } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyHeading } from "../../components/root/MyHeading.jsx";

export function ManagementPage() {
  const [memberList, setMemberList] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/api/manager/list")
      .then((res) => {
        const {members, boards} = res.data
        setMemberList(members);
        setBoardList(boards);
      })
      .catch((e) => {
        console.log(e)
        console.log("error")
      })
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
          p="4"
        >
          <TableRoot interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>아이디</Table.ColumnHeader>
                <Table.ColumnHeader>이메일</Table.ColumnHeader>
                <Table.ColumnHeader>가입일시</Table.ColumnHeader>
                <Table.ColumnHeader>매너점수</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {memberList.length > 0 ? (
                memberList.map((member) => (
                  <Table.Row
                    onClick={() => handleRowClick(member.id)}
                    key={member.id}
                  >
                    <Table.Cell>{member.id}</Table.Cell>
                    <Table.Cell>{member.email}</Table.Cell>
                    <Table.Cell>{member.inserted}</Table.Cell>
                    <Table.Cell>{member.point}점</Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={4} style={{textAlign: "center"}}>
                    <p>회원이 등록되지 않았습니다.</p>
                  </Table.Cell>
                </Table.Row>
              )}
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
            p="4"
          >
            <TableRoot interactive>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>게시글 번호</Table.ColumnHeader>
                  <Table.ColumnHeader>제목</Table.ColumnHeader>
                  <Table.ColumnHeader>작성자</Table.ColumnHeader>
                  <Table.ColumnHeader>작성일자</Table.ColumnHeader>
                  <Table.ColumnHeader>낚시종류</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {boardList.length > 0 ? (
                  boardList.map((board) => (
                    <Table.Row
                      onClick={() => handleRowClick(board.number)}
                      key={board.number}
                    >
                      <Table.Cell>{board.number}</Table.Cell>
                      <Table.Cell>{board.title}</Table.Cell>
                      <Table.Cell>{board.writer}</Table.Cell>
                      <Table.Cell>{board.date}</Table.Cell>
                      <Table.Cell>{board.site}</Table.Cell>
                    </Table.Row>
                ))
                ): (
                  <Table.Row>
                    <Table.Cell colSpan={5} style={{ textAlign: "center" }}>
                      <p>게시글이 등록되지 않았습니다.</p>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </TableRoot>
          </Box>
        </Flex>
      </Flex>

  );
}
