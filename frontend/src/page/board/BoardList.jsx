import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
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
            {board.number}
            {board.title}
            {board.writer}
            {board.viewCount}
            {board.date}
          </li>
        ))}
      </div>

      {/*<SimpleGrid columns={2} gap="40px">*/}
      {/*  <DecorativeBox height="20" />*/}
      {/*  <DecorativeBox height="20" />*/}
      {/*  <DecorativeBox height="20" />*/}
      {/*  <DecorativeBox height="20" />*/}
      {/*</SimpleGrid>*/}
    </Box>
  );
}
