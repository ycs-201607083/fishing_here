import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { Box, Card, Flex, Spacer, Text, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import * as PropTypes from "prop-types";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

function DeleteButton({ onClick }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      placement={"center"}
      role="alertdialog"
    >
      <DialogTrigger asChild>
        <Button
          colorPalette={"red"}
          variant={"ghost"}
          fontWeight={"bold"}
          size="xs"
        >
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제 확인</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>댓글을 삭제하시겠습니까?</Text>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette={"blue"}>
              <Text fontSize={"18px"}>취소</Text>
            </Button>
          </DialogActionTrigger>
          <Button colorPalette={"red"} variant={"outline"} onClick={onClick}>
            <Text fontSize={"18px"}>삭제</Text>
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

DeleteButton.propTypes = { onClick: PropTypes.func };

export function QuesCommentItem({
  comment,
  contentWriter,
  onDeleteClick,
  onEditClick,
}) {
  const { hasAccess, isAuthenticated, isAdmin } = useContext(
    AuthenticationContext,
  );
  const [isEdit, setIsEdit] = useState(false);
  const [editComment, setEditComment] = useState(comment.comment);

  const canViewComment =
    !comment.secret || hasAccess(contentWriter) || hasAccess(comment.writer);

  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleSaveClick = () => {
    if (isEdit) {
      onEditClick(comment.id, editComment);
    }
    setIsEdit(false);
  };

  const handleCancelClick = () => {
    setIsEdit(false);
    setEditComment(comment.comment);
  };

  const handleDeleteClick = () => {};

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
              <Box>{comment.writer}</Box>
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
          <Button
            colorPalette={"green"}
            variant={"ghost"}
            fontWeight={"bold"}
            size="xs"
          >
            답글달기
          </Button>
          {hasAccess(comment.writer) &&
            (isEdit ? (
              <>
                <Button
                  colorPalette={"blue"}
                  variant={"ghost"}
                  fontWeight={"bold"}
                  size="xs"
                  onClick={handleSaveClick}
                >
                  저장
                </Button>
                <Button
                  colorPalette={"red"}
                  variant={"ghost"}
                  fontWeight={"bold"}
                  size="xs"
                  onClick={handleCancelClick}
                >
                  취소
                </Button>
              </>
            ) : (
              <>
                <Button
                  colorPalette={"blue"}
                  variant={"ghost"}
                  fontWeight={"bold"}
                  size="xs"
                  onClick={handleEditClick}
                >
                  수정
                </Button>

                <DeleteButton onClick={() => onDeleteClick(comment.id)} />
              </>
            ))}
        </Card.Footer>
      </Card.Root>
    </Box>
  );
}
