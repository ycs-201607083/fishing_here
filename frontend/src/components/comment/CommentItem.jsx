import { Box, Flex, HStack, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useState } from "react";
import axios from "axios";

export function CommentItem({ comment, onDeleteClick }) {
  const [isEditing, setIsEditing] = useState(false); //수정 모드 상태 추가
  const [editedComment, setEditedComment] = useState(comment.comment); // 수정 내용 상태 추가

  const handleEditSave = () => {
    axios
      .post(`/api/comment/edit/${comment.id}`, { comment: editedComment })
      .then(() => {
        setIsEditing(false);
        window.location.reload(); // 수정: 새로고침
      });
  };

  return (
    <HStack border={"1px solid black"} m={5}>
      <Box flex={1}>
        <Flex justify={"space-between"}>
          <h3>{comment.memberId}</h3>
          <h4>{comment.inserted}</h4>
        </Flex>
        {isEditing ? (
          <Textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
        ) : (
          <p>{comment.comment}</p>
        )}
      </Box>
      <Box>
        {isEditing ? (
          <Button colorPalette="green" onClick={handleEditSave}>
            저장
          </Button>
        ) : (
          <Button colorPalette="purple" onClick={() => setIsEditing(true)}>
            수정
          </Button>
        )}
        <Button colorPalette="red" onClick={() => onDeleteClick(comment.id)}>
          삭제
        </Button>
      </Box>
    </HStack>
  );
}
