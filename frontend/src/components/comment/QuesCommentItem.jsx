import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { Box, Card, Flex, Spacer, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { QuesDeleteButton } from "./QuesDeleteButton.jsx";
import { QuesReCommentInput } from "./QuesReCommentInput.jsx";
import { FaLock } from "react-icons/fa6";

export function QuesCommentItem({
  quesId,
  contentWriter,
  comment,
  onDeleteClick,
  onEditClick,
  onReCommentSaveClick,
  isChild,
}) {
  const { hasAccess, isAuthenticated } = useContext(AuthenticationContext);
  const [isEdit, setIsEdit] = useState(false);
  const [editComment, setEditComment] = useState(comment.comment);

  // 대댓글 입력 상태
  const [reCommentOpen, setReCommentOpen] = useState(false);

  const canViewComment =
    !comment.secret || hasAccess(contentWriter) || hasAccess(comment.writer);

  return (
    <Box pt={2}>
      <Card.Root>
        <Card.Header
          bgColor={"gray.100"}
          borderRadius={"6px 6px 0px 0px"}
          borderBottom="1px dashed #000"
          pt={2}
          pb={2}
        >
          <Card.Title>
            <Flex>
              {comment.secret ? <FaLock /> : ""}
              <Box pl={3}>{comment.writer}</Box>
              <Spacer />
              <Box fontSize={"12px"}>{comment.inserted}</Box>
            </Flex>
          </Card.Title>
        </Card.Header>
        <Card.Body pt={2}>
          {canViewComment ? (
            isEdit ? (
              <Textarea
                value={editComment}
                resize="none"
                onChange={(e) => setEditComment(e.target.value)}
              />
            ) : (
              <Card.Description>{comment.comment}</Card.Description>
            )
          ) : (
            <Card.Description>비밀 댓글입니다.</Card.Description>
          )}
        </Card.Body>
        <Card.Footer justifyContent="flex-end" mt={-5}>
          {isAuthenticated &&
            (isEdit ? (
              <>
                <Button
                  colorPalette="blue"
                  variant="ghost"
                  fontWeight="bold"
                  size="xs"
                  onClick={() => {
                    onEditClick(comment.id, editComment, isChild);
                    setIsEdit(false);
                  }}
                >
                  저장
                </Button>
                <Button
                  colorPalette="red"
                  variant="ghost"
                  fontWeight="bold"
                  size="xs"
                  onClick={() => {
                    setIsEdit(false);
                    setEditComment(comment.comment);
                  }}
                >
                  취소
                </Button>
              </>
            ) : (
              <>
                {isAuthenticated && (
                  <Button
                    colorPalette="green"
                    variant="ghost"
                    fontWeight="bold"
                    size="xs"
                    onClick={() => setReCommentOpen(true)}
                  >
                    답글달기
                  </Button>
                )}
                <Button
                  colorPalette="blue"
                  variant="ghost"
                  fontWeight="bold"
                  size="xs"
                  onClick={() => setIsEdit(true)}
                >
                  수정
                </Button>
                <QuesDeleteButton
                  onClick={() => onDeleteClick(comment.id, isChild)}
                />
              </>
            ))}
        </Card.Footer>
      </Card.Root>

      {/** 대댓글 입력 창 */}
      {reCommentOpen && (
        <QuesReCommentInput
          quesId={quesId}
          parentId={comment.id}
          onClick={onReCommentSaveClick}
          reCommentOpen={setReCommentOpen}
          onReCommentComplete={() => setReCommentOpen(false)}
        />
      )}
    </Box>
  );
}
