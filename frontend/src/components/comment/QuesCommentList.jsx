import { Box } from "@chakra-ui/react";
import { QuesCommentItem } from "./QuesCommentItem.jsx";

export function QuesCommentList({
  commentList,
  reCommentList,
  writer,
  onDeleteClick,
  onEditClick,
  onReComment,
}) {
  return (
    <Box>
      {commentList.map((comment) => (
        <Box key={comment.id}>
          <QuesCommentItem
            comment={comment}
            contentWriter={writer}
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
            onReComment={onReComment}
            isChild={false}
          />
          {reCommentList
            .filter((reComment) => reComment.parentId === comment.id)
            .map((reComment) => (
              <Box key={reComment.id} pl={6}>
                <QuesCommentItem
                  comment={reComment}
                  contentWriter={writer}
                  onDeleteClick={onDeleteClick}
                  onEditClick={onEditClick}
                  onReComment={onReComment}
                  isChild={true}
                />
              </Box>
            ))}
        </Box>
      ))}
    </Box>
  );
}
