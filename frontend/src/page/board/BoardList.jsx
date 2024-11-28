import { Box, Center, HStack, Spinner, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardList() {
  // 게시판 데이터 상태
  const [boardList, setBoardList] = useState([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 에러 메시지 상태
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchBoardList();
  }, []);

  const fetchBoardList = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get("/api/board/list");
      setBoardList(response.data);
    } catch (error) {
      console.error("데이터를 불러오는 데 실페하였습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <h3>게시물 목록</h3>
      {isLoading ? (
        <Center h="100vh">
          <HStack gap="5">
            <Spinner size="xl" />
          </HStack>
        </Center>
      ) : errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <Table.Root interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>번호</Table.ColumnHeader>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>조회수</Table.ColumnHeader>
              <Table.ColumnHeader>작성일시</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {boardList.map((board) => (
              <Table.Row key={board.number}>
                <Table.Cell>{board.number}</Table.Cell>
                <Table.Cell>{board.title}</Table.Cell>
                <Table.Cell>{board.writer}</Table.Cell>
                <Table.Cell>{board.viewCount}</Table.Cell>
                <Table.Cell>{board.date}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}
