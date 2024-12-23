import { Box, Spacer, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

export function CommentInput({ boardId, onSaveClick }) {
  const [comment, setComment] = useState("");
  const [chartLabel, setChartLabel] = useState("");
  const [chartValue, setChartValue] = useState("");
  const { isAuthenticated } = useContext(AuthenticationContext);

  const handleSave = () => {
    if (window.confirm("댓글을 저장하시겠습니까?")) {
      if (!boardId) {
        console.error("Cannot save comment: boardId is undefined.");
        return;
      }

      if (comment.trim()) {
        onSaveClick(comment, chartLabel, chartValue);
        setComment("");
        setChartLabel("");
        setChartValue("");
        window.location.reload(); // 댓글 저장 후 페이지 새로 고침
      } else {
        alert("댓글을 입력하세요.");
      }
    }
  };

  return (
    <Box>
      <Textarea
        resize="none"
        h={"100px"}
        disabled={!isAuthenticated}
        value={comment}
        placeholder={
          isAuthenticated
            ? "댓글을 입력해 주세요"
            : "로그인 후 댓글을 입력해주세요"
        }
        onChange={(e) => setComment(e.target.value)}
      />

      <Spacer />
      <Button onClick={handleSave} ml={650}>
        댓글 쓰기
      </Button>
    </Box>
  );
}
