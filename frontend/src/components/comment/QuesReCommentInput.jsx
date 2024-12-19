import React, { useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";
import { Box, Flex, Spacer, Textarea } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button.jsx";

export function QuesReCommentInput({ quesId, parentId, onReCommentComplete }) {
  const [reCommentText, setReCommentText] = useState("");
  const [checkSecret, setCheckSecret] = useState(false);

  const handleReCommentSave = () => {
    axios
      .post(`/api/comment/reQuesAdd`, {
        quesId: quesId,
        parentId: parentId,
        comment: reCommentText,
        secret: checkSecret,
      })
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setReCommentText("");
        setCheckSecret(false);
        onReCommentComplete(); // 저장 완료 시 상위 컴포넌트에 알림
      })
      .catch((e) => {
        toaster.create({
          type: "error",
          description: "대댓글 작성 중 오류가 발생했습니다.",
        });
      });
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
          onClick={handleReCommentSave}
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
