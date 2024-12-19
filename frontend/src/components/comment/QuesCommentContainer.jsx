import { useEffect, useState } from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { QuesCommentInput } from "./QuesCommentInput.jsx";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";
import { QuesCommentList } from "./QuesCommentList.jsx";

export function QuesCommentContainer({ quesId, writer }) {
  const [commentList, setCommentList] = useState([]);
  const [reCommentList, setReCommentList] = useState([]);
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

  useEffect(() => {
    if (!processing) {
      axios
        .get(`/api/comment/quesReCommentList/${quesId}`)
        .then((res) => res.data)
        .then((data) => {
          setReCommentList(data);
          console.log(data, "자식댓글됨");
        })
        .catch((e) => {
          console.log(e, "자식댓글안됨");
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
      .catch(() => {
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

  function handleDeleteClick(id) {
    setProcessing(true);
    axios
      .delete(`/api/comment/quesRemove/${id}`)
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .catch(() => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => setProcessing(false));
  }

  // function handleReCommentClick(parentId, reComment, secret) {
  //   setProcessing(true);
  //   axios
  //     .post(`/api/comment/reQuesAdd`, {
  //       quesId: quesId,
  //       parentId: parentId,
  //       comment: reComment,
  //       secret: secret,
  //     })
  //     .then((res) => res.data)
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .finally(() => setProcessing(false));
  // }

  function handleEditClick(id, comment) {
    console.log(id, comment);
    setProcessing(true);
    axios
      .put("/api/comment/quesEdit", {
        id,
        comment,
      })
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => setProcessing(false));
  }

  return (
    <Box pt={5}>
      <Heading>댓글</Heading>
      <Stack>
        <QuesCommentInput quesId={quesId} onSaveClick={handleSaveClick} />
        <QuesCommentList
          quesId={quesId}
          commentList={commentList}
          reCommentList={reCommentList}
          contentWriter={writer}
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
          // onReCommentAdd={handleReCommentClick} // 답글 이벤트 전달
        />
      </Stack>
    </Box>
  );
}
