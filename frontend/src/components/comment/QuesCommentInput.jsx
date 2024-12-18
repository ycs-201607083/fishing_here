import { Box, Flex, Spacer, Textarea } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { Button } from "../ui/button.jsx";

export function QuesCommentInput({ quesId, onSaveClick }) {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const [comment, setComment] = useState("");
  const [secret, setSecret] = useState(false);

  const handleSaveClick = () => {
    onSaveClick(comment, secret);
    setComment("");
    setSecret(false);
  };

  return (
    <Box>
      <Textarea
        resize="none"
        h={"100px"}
        disabled={!isAuthenticated}
        placeholder={
          isAuthenticated
            ? "댓글을 입력해 주세요"
            : "로그인 후 댓글을 입력해주세요"
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Flex>
        <Checkbox
          checked={secret}
          onChange={(e) => setSecret(e.target.checked)}
        >
          비밀글
        </Checkbox>
        <Spacer />
        <Button onClick={handleSaveClick}>댓글쓰기</Button>
      </Flex>
    </Box>
  );
}
