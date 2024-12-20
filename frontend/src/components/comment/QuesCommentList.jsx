import { Box } from "@chakra-ui/react";
import { QuesCommentItem } from "./QuesCommentItem.jsx";
import { QuesReCommentItem } from "./QuesReCommentItem.jsx";

export function QuesCommentList({
  quesId,
  commentList,
  reCommentList,
  contentWriter,
  onDeleteClick,
  onEditClick,
  onReCommentSaveClick,
}) {
  return (
    <Box>
      {commentList.map((comment) => (
        <Box key={comment.id}>
          <QuesCommentItem
            quesId={quesId}
            comment={comment}
            contentWriter={contentWriter}
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
            onReCommentSaveClick={onReCommentSaveClick}
            isChild={false}
          />
          {reCommentList
            .filter((reComment) => reComment.parentId === comment.id)
            .map((reComment) => (
              <Box key={reComment.id} pl={6} pt={2}>
                <QuesReCommentItem
                  quesId={quesId}
                  parentComment={comment}
                  reComment={reComment}
                  contentWriter={contentWriter}
                  onDeleteClick={onDeleteClick}
                  onEditClick={onEditClick}
                  isChild={true}
                />
              </Box>
            ))}
        </Box>
      ))}
    </Box>
  );
}
