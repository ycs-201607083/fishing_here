import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { Box, Card, Flex, Spacer, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";

export function CommentItem({ comment, onDeleteClick }) {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedComment, setEditedComment] = useState(comment.comment); // 수정 내용 상태
  const { hasAccess } = useContext(AuthenticationContext); // 사용자 접근 권한 확인

  // 댓글 수정 저장 처리
  const handleEditSave = () => {
    if (window.confirm("댓글을 저장하시겠습니까?")) {
      // 저장 확인 메시지
      axios
        .post(`/api/comment/edit/${comment.id}`, { comment: editedComment })
        .then(() => {
          setIsEditing(false);
          window.location.reload(); // 댓글 수정 후 페이지 새로 고침
        })
        .catch((error) => {
          console.error("댓글 수정 실패:", error);
        });
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      // 삭제 확인 메시지
      onDeleteClick(comment.id);
      window.location.reload(); // 댓글 삭제 후 페이지 새로 고침
    }
  };

  return (
    <Box pt={2}>
      <Card.Root>
        {/* 댓글 헤더 */}
        <Card.Header
          bgColor={"gray.100"}
          borderRadius={"6px 6px 0px 0px"}
          borderBottom="1px dashed #000"
          pt={2}
          pb={2}
        >
          <Card.Title>
            <Flex>
              <Box pl={3}>{comment.memberId}</Box>
              <Spacer />
              <Box fontSize={"12px"}>{comment.inserted}</Box>
            </Flex>
          </Card.Title>
        </Card.Header>

        {/* 댓글 본문 */}
        <Card.Body pt={2}>
          {isEditing ? (
            <Textarea
              value={editedComment}
              resize="none"
              onChange={(e) => setEditedComment(e.target.value)}
            />
          ) : (
            <Card.Description>{comment.comment}</Card.Description>
          )}
        </Card.Body>

        {/* 댓글 푸터 */}
        <Card.Footer justifyContent="flex-end" mt={-5}>
          {isEditing ? (
            <>
              <Button
                colorPalette="blue"
                variant="ghost"
                fontWeight="bold"
                size="xs"
                onClick={handleEditSave}
              >
                저장
              </Button>
              <Button
                colorPalette="red"
                variant="ghost"
                fontWeight="bold"
                size="xs"
                onClick={() => {
                  setIsEditing(false);
                  setEditedComment(comment.comment); // 수정 취소 시 원래 내용 복원
                }}
              >
                취소
              </Button>
            </>
          ) : (
            hasAccess(comment.memberId) && ( // 수정, 삭제 버튼은 작성자만 볼 수 있도록 조건 추가
              <>
                <Button
                  colorPalette="purple"
                  variant="ghost"
                  fontWeight="bold"
                  size="xs"
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </Button>
                <Button
                  colorPalette="red"
                  variant="ghost"
                  fontWeight="bold"
                  size="xs"
                  onClick={handleDeleteClick}
                >
                  삭제
                </Button>
              </>
            )
          )}
        </Card.Footer>
      </Card.Root>
    </Box>
  );
}
