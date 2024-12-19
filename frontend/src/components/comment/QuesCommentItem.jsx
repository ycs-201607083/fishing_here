import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { Box, Card, Flex, Spacer, Text, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";

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
import { Checkbox } from "../ui/checkbox";
import axios from "axios";

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

export function QuesCommentItem({
  quesId /*본문 번호*/,
  contentWriter /*본문 글쓴이*/,
  comment,
  onDeleteClick,
  onEditClick,
}) {
  const { hasAccess, isAuthenticated } = useContext(AuthenticationContext);
  const [isEdit, setIsEdit] = useState(false);
  const [reCommentOpen, setReCommentOpen] = useState(false);
  const [editComment, setEditComment] = useState(comment.comment);
  const [checkSecret, setCheckSecret] = useState(false);

  const canViewComment =
    !comment.secret || hasAccess(contentWriter) || hasAccess(comment.writer);

  function handleReCommentClick(parentId, reComment, secret) {
    axios
      .post(`/api/comment/reQuesAdd`, {
        quesId: quesId,
        parentId: parentId,
        comment: reComment,
        secret: secret,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
      });
  }

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
          {hasAccess(comment.writer) &&
            (isEdit ? (
              <>
                <Button
                  colorPalette={"blue"}
                  variant={"ghost"}
                  fontWeight={"bold"}
                  size="xs"
                  onClick={() => {
                    onEditClick(comment.id, editComment);
                    setIsEdit(false);
                  }}
                >
                  저장
                </Button>
                <Button
                  colorPalette={"red"}
                  variant={"ghost"}
                  fontWeight={"bold"}
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
                    colorPalette={"green"}
                    variant={"ghost"}
                    fontWeight={"bold"}
                    size="xs"
                    onClick={() => setReCommentOpen(true)}
                  >
                    답글달기
                  </Button>
                )}
                <Button
                  colorPalette={"blue"}
                  variant={"ghost"}
                  fontWeight={"bold"}
                  size="xs"
                  onClick={() => setIsEdit(true)}
                >
                  수정
                </Button>
                <DeleteButton onClick={() => onDeleteClick(comment.id)} />
              </>
            ))}
        </Card.Footer>
      </Card.Root>
      {/*대댓글 달기*/}
      {reCommentOpen && (
        <Box mt={4} pl={4} borderLeft="2px solid #ddd">
          <Textarea resize={"none"} />
          <Flex justifyContent="flex-end" mt={2}>
            <Checkbox onChange={() => setCheckSecret(e.target.click)}>
              비밀글
            </Checkbox>
            <Spacer />
            <Button
              colorPalette={"blue"}
              variant={"ghost"}
              fontWeight={"bold"}
              size="xs"
              onClick={handleReCommentClick}
            >
              저장
            </Button>
            <Button
              colorPalette={"red"}
              variant={"ghost"}
              fontWeight={"bold"}
              size="xs"
              onClick={() => {
                setReCommentOpen(false);
              }}
            >
              취소
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
