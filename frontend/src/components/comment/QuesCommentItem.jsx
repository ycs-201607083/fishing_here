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
  comment,
  contentWriter /*본문 글쓴이*/,
  onDeleteClick,
  onEditClick,
  onReComment,
  isChild,
}) {
  const { hasAccess } = useContext(AuthenticationContext);
  const [isEdit, setIsEdit] = useState(false);
  const [reCommentOpen, setReCommentOpen] = useState(false); // 답글 작성 상태
  const [editComment, setEditComment] = useState(comment.comment);
  const [reComment, setReComment] = useState(""); // 답글 내용
  const [secret, setSecret] = useState(false);

  const canViewComment =
    !comment.secret || hasAccess(contentWriter) || hasAccess(comment.writer);

  const handleReplyClick = () => {
    onReComment(comment.id, reComment, secret); // 부모 컴포넌트로 답글 데이터 전달
    setReComment(""); // 답글 입력창 초기화
    setReCommentOpen(false); // 답글 창 닫기
    setSecret(false);
  };

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
          {!isChild && (
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
          <Textarea
            value={reComment}
            onChange={(e) => setReComment(e.target.value)}
            placeholder="답글을 입력하세요"
            size="sm"
          />
          <Flex justifyContent="flex-end" mt={2}>
            <Checkbox
              checked={secret}
              onChange={(e) => setSecret(e.target.checked)}
            >
              비밀글
            </Checkbox>

            <Button colorPalette={"blue"} size="xs" onClick={handleReplyClick}>
              작성
            </Button>
            <Button
              size="xs"
              onClick={() => {
                setReComment("");
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
