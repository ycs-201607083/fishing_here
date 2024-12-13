import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export function BoardWritten() {
  const { id } = useParams(); // URL에서 id를 가져옵니다.
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  useEffect(() => {
    // API 호출
    axios
      .get(`/api/board/written/${id}`)
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
    alert(`게시글 번호: ${number}`); // 클릭 이벤트 예시
  };

  if (loading) {
    return <Spinner />; // 로딩 중이면 Spinner를 표시
  }

  if (error) {
    return <Text color="red.500">오류 발생: {error}</Text>; // 오류가 있으면 오류 메시지 표시
  }

  return (
    <Box>
      <h3>내 게시글 보기</h3>
      <Table interactive>
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
          {posts.map((post) => (
            <Table.Row
              key={post.number}
              onClick={() => handleRowClick(post.number)}
              style={{ cursor: "pointer" }}
            >
              <Table.Cell>{post.number}</Table.Cell>
              <Table.Cell>{post.site}</Table.Cell>
              <Table.Cell>{post.title}</Table.Cell>
              <Table.Cell>{post.content}</Table.Cell>
              <Table.Cell>{post.writer}</Table.Cell>
              <Table.Cell>{post.viewCount}</Table.Cell>
              <Table.Cell>{post.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
}
