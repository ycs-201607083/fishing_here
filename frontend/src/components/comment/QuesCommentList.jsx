import { Box, Flex } from "@chakra-ui/react";
import { QuesCommentItem } from "./QuesCommentItem.jsx";
import { QuesReCommentItem } from "./QuesReCommentItem.jsx";
import { RiArrowDropUpFill } from "react-icons/ri";

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
              <Box key={reComment.id} pl={6}>
                <Flex>
                  <RiArrowDropUpFill size={30} />
                </Flex>

                <QuesReCommentItem
                  quesId={quesId}
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
