import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Spinner, Table, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

export function BoardWritten() {
  const { id } = useParams(); // URL과로에서 id 가져오기
  const [posts, setPosts] = useState([]); // 게시글 목록 상호
  const [loading, setLoading] = useState(true); // 로벌 상호
  const [error, setError] = useState(null); // 오류 상호
  const navigate = useNavigate(); // 페이지 이동에 쓰인

  useEffect(() => {
    axios
      .get(`/api/board/written/${id}`) // API 호출
      .then((response) => {
        setPosts(response.data); // 게시글 데이터를 상호에 저장
        setLoading(false); // 로벌 상호 해지
      })
      .catch((err) => {
        setError(err.message); // 오류 상호 개선
        setLoading(false); // 로벌 상호 해지
      });
  }, [id]);

  const handleRowClick = (number) => {
    navigate(`/board/view/${number}`); // 클릭 게시글 복사
  };

  if (loading) {
    return <Spinner />; // 로벌중 배달
  }

  if (error) {
    return <Text color="red.500">오류 발생: {error}</Text>; // 오류 발생시
  }

  if (posts.length === 0) {
    return <Text>작성된 게시글이 없습니다.</Text>; // 게시글 없을 바실
  }

  return (
    <Box
      w="100%" // 배경조점
      h="55vh" // 한 프린은 반이루
      p="3" // 패니
      bg="gray.100" // 비그 자차
    >
      <Text fontSize="xl" mb={3}>
        내 게시글 보기
      </Text>
      <Box
        w="100%"
        h="55vh"
        overflow="auto"
        border="1px solid #ccc"
        borderRadius="8px"
        p="2"
      >
        <Table.Root interactive>
          <Table.Header>
            <Table.Row
              style={{
                backgroundColor: "#0288d1", // Header Background Color
                color: "white", // Header Text Color
                borderBottom: "1px solid #ccc", // Header Bottom Border
              }}
            >
              <Table.ColumnHeader style={{ borderRight: "1px solid #ccc" }}>
                번호
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ borderRight: "1px solid #ccc" }}>
                낚시 장소
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ borderRight: "1px solid #ccc" }}>
                제목
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ borderRight: "1px solid #ccc" }}>
                본문
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ borderRight: "1px solid #ccc" }}>
                작성자
              </Table.ColumnHeader>
              <Table.ColumnHeader style={{ borderRight: "1px solid #ccc" }}>
                조회수
              </Table.ColumnHeader>
              <Table.ColumnHeader>작성일시</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {posts.length > 0 ? (
              posts.map((board) => (
                <Table.Row
                  key={board.number}
                  onClick={() => handleRowClick(board.number)}
                  style={{ cursor: "pointer", borderBottom: "1px solid #ccc" }} // Row Border
                >
                  <Table.Cell style={{ borderRight: "1px solid #ccc" }}>
                    {board.number}
                  </Table.Cell>{" "}
                  {/* Cell Border */}
                  <Table.Cell style={{ borderRight: "1px solid #ccc" }}>
                    {board.site}
                  </Table.Cell>
                  <Table.Cell style={{ borderRight: "1px solid #ccc" }}>
                    {board.title}
                  </Table.Cell>
                  <Table.Cell style={{ borderRight: "1px solid #ccc" }}>
                    {board.content}
                  </Table.Cell>
                  <Table.Cell style={{ borderRight: "1px solid #ccc" }}>
                    {board.writer}
                  </Table.Cell>
                  <Table.Cell style={{ borderRight: "1px solid #ccc" }}>
                    {board.viewCount}
                  </Table.Cell>
                  <Table.Cell>{board.date}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row style={{ borderBottom: "1px solid #ccc" }}>
                {" "}
                {/* No Posts Row Border */}
                <Table.Cell colSpan={7} style={{ textAlign: "center" }}>
                  게시글이 등록되지 않았습니다.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
