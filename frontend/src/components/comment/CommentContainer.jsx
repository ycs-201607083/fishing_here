import { Box, Heading, Stack } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

export function CommentContainer({ boardId }) {
  const [commentList, setCommentList] = useState([]);
  const [processing, setProcessing] = useState(false);

  // boardId가 전달되지 않은 경우 경고 및 기본값 설정
  useEffect(() => {
    if (!boardId) {
      console.error("boardId is undefined. Please check parent component.");
    }
  }, [boardId]);

  useEffect(() => {
    if (!processing && boardId) {
      // boardId가 유효한 경우에만 호출
      axios
        .get(`/api/comment/list/${boardId}`)
        .then((res) => res.data)
        .then((data) => setCommentList(data))
        .catch((err) => {
          console.error("Failed to fetch comment list:", err); // 디버깅 로그 추가
        });
    }
  }, [processing, boardId]);

  function handleSaveClick(comment, chartLabel, chartValue) {
    if (!boardId) {
      console.error("Cannot save comment: boardId is undefined.");
      return;
    }

    setProcessing(true);
    axios
      .post("/api/comment/add", {
        boardId,
        comment,
        chartLabel,
        chartValue,
      })
      .then(() => console.log("Comment added successfully"))
      .catch((err) => console.error("Failed to add comment:", err)) // 디버깅 로그 추가
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleDeleteClick(id) {
    setProcessing(true);
    axios({
      method: "DELETE", // HTTP 메서드 명시
      url: `/api/comment/remove/${id}`,
    })
      .then(() => console.log("Comment deleted successfully"))
      .catch((err) => console.error("Failed to delete comment:", err)) // 디버깅 로그 추가
      .finally(() => {
        setProcessing(false);
      });
  }

  return (
    <Box pt={5}>
      <Heading>댓글</Heading>
      <Stack gap={2}>
        <CommentInput boardId={boardId} onSaveClick={handleSaveClick} />
        <CommentList
          boardId={boardId}
          commentList={commentList}
          onDeleteClick={handleDeleteClick}
        />
      </Stack>
    </Box>
  );
}
