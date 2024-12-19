import { Box } from "@chakra-ui/react";
import { QuesCommentItem } from "./QuesCommentItem.jsx";
import * as PropTypes from "prop-types";

function QuesReCommentItem({
  reComment,
  contentWriter,
  onDeleteClick,
  onEditClick,
  onReComment,
}) {
  return null;
}

QuesReCommentItem.propTypes = { isChild: PropTypes.bool };

export function QuesCommentList({
  commentList,
  reCommentList,
  contentWriter,
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
            contentWriter={contentWriter}
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
            onReComment={onReComment}
          />
          {reCommentList
            .filter((reComment) => reComment.parentId === comment.id)
            .map((reComment) => (
              <Box key={reComment.id} pl={6}>
                <QuesReCommentItem
                  reComment={reComment}
                  contentWriter={contentWriter}
                  onDeleteClick={onDeleteClick}
                  onEditClick={onEditClick}
                  onReComment={onReComment}
                />
              </Box>
            ))}
        </Box>
      ))}
    </Box>
  );
}
