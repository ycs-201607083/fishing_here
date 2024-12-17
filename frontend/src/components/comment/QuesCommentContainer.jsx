import { useEffect, useState } from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { QuesCommentInput } from "./QuesCommentInput.jsx";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";

export function QuesCommentContainer({ quesId }) {
  const [commentList, setCommentList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {}, []);

  function handleSaveClick(comment, secret) {
    console.log(quesId, comment, secret);
    axios
      .post("/api/comment/quesAdd", {
        quesId: quesId,
        comment: comment,
        secret: secret,
      })
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          text: message.text,
        });
      });
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
