import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Spinner, Table, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

export function BoardWritten() {
  const { id } = useParams(); // URL에서 id를 가져옵니다.
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const navigate = useNavigate(); // 페이지 이동용

  useEffect(() => {
    axios
      .get(`/api/board/written/${id}`) // API 호출
      .then((response) => {
        setPosts(response.data); // 게시글 데이터를 상태에 저장
        setLoading(false); // 로딩 상태 false
      })
      .catch((err) => {
        setError(err.message); // 오류 상태 업데이트
        setLoading(false); // 로딩 상태 false
      });
  }, [id]);

  const handleRowClick = (number) => {
    navigate(`/board/view/${number}`); // 클릭한 게시글로 이동
  };

  if (loading) {
    return <Spinner />; // 로딩 중일 때
  }

  if (error) {
    return <Text color="red.500">오류 발생: {error}</Text>; // 오류 발생 시
  }

  if (posts.length === 0) {
    return <Text>작성된 게시글이 없습니다.</Text>; // 게시글이 없을 때
  }

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        내 게시글 보기
      </Text>
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>번호</Table.ColumnHeader>
            <Table.ColumnHeader>낚시 장소</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader>본문</Table.ColumnHeader>
            <Table.ColumnHeader>작성자</Table.ColumnHeader>
            <Table.ColumnHeader>조회수</Table.ColumnHeader>
            <Table.ColumnHeader>작성일시</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {posts.map((board) => (
            <tr
              key={board.number}
              onClick={() => handleRowClick(board.number)}
              style={{ cursor: "pointer" }}
            >
              <td>{board.number}</td>
              <td>{board.site}</td>
              <td>{board.title}</td>
              <td>{board.content}</td>
              <td>{board.writer}</td>
              <td>{board.viewCount}</td>
              <td>{board.date}</td>
            </tr>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
