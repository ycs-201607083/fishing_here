import { Box } from "@chakra-ui/react";
import { QuesCommentItem } from "./QuesCommentItem.jsx";

export function QuesCommentList({
  commentList,
  writer,
  onDeleteClick,
  onEditClick,
}) {
  return (
    <Box>
      {commentList.map((comment) => (
        <QuesCommentItem
          key={comment.id}
          comment={comment}
          contentWriter={writer}
          onDeleteClick={onDeleteClick}
          onEditClick={onEditClick}
        />
      ))}
    </Box>
  );
}
