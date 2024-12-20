import React, { useContext, useState } from "react";
import { Box, Flex, Spacer, Textarea } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button.jsx";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

export function QuesReCommentInput({
  quesId,
  parentId,
  onReCommentComplete,
  reCommentOpen,
  onClick,
}) {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const [reCommentText, setReCommentText] = useState("");
  const [checkSecret, setCheckSecret] = useState(false);

  const handleSaveClick = () => {
    if (isAuthenticated) {
      onClick(parentId, reCommentText, checkSecret);
      reCommentOpen(false);
      setReCommentText("");
    }
  };
  return (
    <Box mt={4} pl={4} borderLeft="2px solid #ddd">
      <Textarea
        resize="none"
        value={reCommentText}
        onChange={(e) => setReCommentText(e.target.value)}
        placeholder="대댓글을 입력하세요"
      />
      <Flex justifyContent="flex-end" mt={2}>
        <Checkbox
          checked={checkSecret}
          onChange={(e) => setCheckSecret(e.target.checked)}
        >
          비밀글
        </Checkbox>
        <Spacer />
        <Button
          colorPalette="blue"
          variant="ghost"
          fontWeight="bold"
          size="xs"
          onClick={handleSaveClick}
        >
          저장
        </Button>
        <Button
          colorPalette="red"
          variant="ghost"
          fontWeight="bold"
          size="xs"
          onClick={onReCommentComplete} // 취소 시 상위 컴포넌트에 알림
        >
          취소
        </Button>
      </Flex>
    </Box>
  );
}
