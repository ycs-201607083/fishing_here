import { Box } from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({ boardId, commentList, onDeleteClick }) {
  if (commentList.length === 0) {
    return <p>등록된 댓글이 없습니다.</p>; // 수정: 빈 목록 메시지 추가
  }

  return (
    <Box>
      {commentList.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDeleteClick={onDeleteClick} // 수정: 삭제 핸들러 전달
        />
      ))}
    </Box>
  );
}
