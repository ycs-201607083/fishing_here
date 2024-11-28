import { Box, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => res.data)
      .then((data) => setBoardList(data));
  }, []);

  return (
    <Box>
      <h3>게시물 목록</h3>
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
    </Box>
  );
}
