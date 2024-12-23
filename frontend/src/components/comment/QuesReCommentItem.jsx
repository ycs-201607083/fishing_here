import { Box, Card, Flex, Spacer, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { QuesDeleteButton } from "./QuesDeleteButton.jsx";
import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { RiArrowDropUpFill } from "react-icons/ri";
import { FaLock } from "react-icons/fa6";

export function QuesReCommentItem({
  parentComment,
  reComment,
  contentWriter,
  onDeleteClick,
  onEditClick,
  isChild,
}) {
  const { hasAccess, isAuthenticated } = useContext(AuthenticationContext);
  const [isEdit, setIsEdit] = useState(false);
  const [editComment, setEditComment] = useState(reComment.comment);

  const canViewComment =
    !reComment.secret ||
    hasAccess(reComment.writer) ||
    hasAccess(contentWriter) ||
    hasAccess(parentComment.writer);

  return (
    <Box>
      <Card.Root>
        <Card.Header
          bgColor={"gray.300"}
          borderRadius={"6px 6px 0px 0px"}
          borderBottom="1px dashed #000"
          pt={2}
          pb={2}
        >
          <Card.Title>
            <Flex>
              {reComment.secret ? <FaLock color={"red"} /> : ""}
              <RiArrowDropUpFill size={30} />
              <Box pl={3}>{reComment.writer}</Box>
              <Spacer />
              <Box fontSize={"12px"}>{reComment.inserted}</Box>
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
              <Card.Description>{reComment.comment}</Card.Description>
            )
          ) : (
            <Card.Description>비밀 댓글입니다.</Card.Description>
          )}
        </Card.Body>
        <Card.Footer justifyContent="flex-end" mt={-5}>
          {hasAccess(reComment.writer) &&
            (isEdit ? (
              <>
                <Button
                  colorPalette="blue"
                  variant="ghost"
                  fontWeight="bold"
                  size="xs"
                  onClick={() => {
                    onEditClick(reComment.id, editComment, isChild);
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
                    setEditComment(reComment.comment);
                  }}
                >
                  취소
                </Button>
              </>
            ) : (
              <>
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
                  onClick={() => onDeleteClick(reComment.id, isChild)}
                />
              </>
            ))}
        </Card.Footer>
      </Card.Root>
    </Box>
  );
}
