import { Box, Stack } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
/*차트 요소 등록 코드*/
ChartJS.register(ArcElement, Tooltip, Legend);

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

  function handleSaveClick(comment) {
    if (!boardId) {
      console.error("Cannot save comment: boardId is undefined.");
      return;
    }
    setProcessing(true);
    axios
      .post("/api/comment/add", {
        boardId: boardId,
        comment: comment,
      })
      .then(() => console.log("Comment added successfully"))
      .catch((err) => console.error("Failed to add comment:", err)) // 디버깅 로그 추가
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleDeleteClick(id) {
    setProcessing(true);
    axios
      .delete(`/api/comment/remove/${id}`)
      .then(() => console.log("Comment deleted successfully"))
      .catch((err) => console.error("Failed to delete comment:", err)) // 디버깅 로그 추가
      .finally(() => {
        setProcessing(false);
      });
  }

  /*차트 데이터*/
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Box>
      <Box w="400px" h="400px">
        {/* Chart.js 컴포넌트 렌더링 */}
        <Doughnut data={data} />
      </Box>
      <Stack gap={5}>
        <h3>댓글</h3>
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
