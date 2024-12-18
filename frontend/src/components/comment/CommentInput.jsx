import { Box, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useState } from "react";

export function CommentInput({ boardId, onSaveClick }) {
  const [comment, setComment] = useState("");

  const handleSave = () => {
    if (!boardId) {
      console.error("Cannot save comment: boardId is undefined."); // 디버깅 추가
      return;
    }

    if (comment.trim()) {
      onSaveClick(comment);
      setComment("");
    } else {
      alert("댓글을 입력하세요.");
    }
  };

  return (
    <Box>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="댓글을 입력하세요."
      />
      <Button onClick={handleSave}>댓글 쓰기</Button>
    </Box>
  );
}
