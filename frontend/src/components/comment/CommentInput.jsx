import { Box, Group, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useState } from "react";
import axios from "axios";

export function CommentInput(boardId, onSaveClick) {
  const [comment, setComment] = useState("");

  function handleSaveClick() {
    axios
      .post("/api/comment/add", {
        boardId: boardId,
        comment: comment,
      })
      .then()
      .catch()
      .finally();
  }

  return (
    <Box>
      <Group>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={() => onSaveClick(comment)}>댓글 쓰기</Button>
      </Group>
    </Box>
  );
}
