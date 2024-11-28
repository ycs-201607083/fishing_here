import React, { useEffect } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
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
      <div>
        {boardList.map((board) => (
          <li>
            {board.board_number}
            {board.board_title}
            {board.board_writer}
            {board.board_view_count}
            {board.board_date}
          </li>
        ))}
      </div>

      <SimpleGrid columns={2} gap="40px">
        <DecorativeBox height="20" />
        <DecorativeBox height="20" />
        <DecorativeBox height="20" />
        <DecorativeBox height="20" />
      </SimpleGrid>
    </Box>
  );
}
