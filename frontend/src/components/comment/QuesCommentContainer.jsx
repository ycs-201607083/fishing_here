import { useEffect, useState } from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { QuesCommentInput } from "./QuesCommentInput.jsx";
import axios from "axios";

export function QuesCommentContainer({ quesId }) {
  const [commentList, setCommentList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {}, []);

  function handleSaveClick(comment) {
    axios.get("/api/comment/quesAdd");
  }

  return (
    <Box pt={5}>
      <Heading>댓글</Heading>
      <Stack>
        <QuesCommentInput quesId={quesId} onSaveClick={handleSaveClick} />
      </Stack>
    </Box>
  );
}
