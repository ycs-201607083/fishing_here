import { useEffect, useState } from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { QuesCommentInput } from "./QuesCommentInput.jsx";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";
import * as PropTypes from "prop-types";
import { QuesCommentList } from "./QuesCommentList.jsx";

QuesCommentList.propTypes = { commentList: PropTypes.arrayOf(PropTypes.any) };

export function QuesCommentContainer({ quesId, writer }) {
  const [commentList, setCommentList] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!processing) {
      axios
        .get(`/api/comment/quesCommentList/${quesId}`)
        .then((res) => res.data)
        .then((data) => {
          setCommentList(data);
          console.log(data, "됨");
        })
        .catch((e) => {
          console.log(e, "안됨");
        });
    }
  }, [processing]);

  function handleSaveClick(comment, secret) {
    console.log(quesId, comment, secret);
    setProcessing(true);
    axios
      .post("/api/comment/quesAdd", {
        quesId: quesId,
        comment: comment,
        secret: secret,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  return (
    <Box pt={5}>
      <Heading>댓글</Heading>
      <Stack>
        <QuesCommentInput quesId={quesId} onSaveClick={handleSaveClick} />
        <QuesCommentList commentList={commentList} writer={writer} />
      </Stack>
    </Box>
  );
}
