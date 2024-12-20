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
    if (!boardId) {
      console.error("Cannot save comment: boardId is undefined."); // 디버깅 추가
      return;
    }

    if (comment.trim()) {
      onSaveClick(comment, chartLabel, chartValue);
      setComment("");
      setChartLabel("");
      setChartValue("");
    } else {
      alert("댓글을 입력하세요.");
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
      {/*<Input*/}
      {/*  value={chartLabel}*/}
      {/*  onChange={(e) => setChartLabel(e.target.value)}*/}
      {/*  placeholder="가장 많이 잡힌 해산물의 명을 입력하세요."*/}
      {/*/>*/}
      {/*<Input*/}
      {/*  type="number"*/}
      {/*  value={chartValue}*/}
      {/*  onChange={(e) => setChartValue(e.target.value)}*/}
      {/*  placeholder="잡힌 해산물의 수를 입력하세요."*/}
      {/*  min={0}*/}
      {/*/>*/}
      <Spacer />
      <Button onClick={handleSave} ml={650}>
        댓글 쓰기
      </Button>
    </Box>
  );
}
