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
        })
        .catch((e) => {
          console.log(e, "자식댓글안됨");
        });
    }
  }, [processing]);

  function handleSaveClick(comment, secret, isChild) {
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

  function handleReCommentSave(parentId, reCommentText, checkSecret) {
    setProcessing(true);
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
      })
      .catch(() => {
        toaster.create({
          type: "error",
          description: "대댓글 작성 중 오류가 발생했습니다.",
        });
      })
      .finally(() => setProcessing(false));
  }

  function handleDeleteClick(id, isChild) {
    setProcessing(true);
    if (!isChild) {
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
    } else {
      axios
        .delete(`/api/comment/reQuesRemove/${id}`)
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
  }

  function handleEditClick(id, comment, isChild) {
    setProcessing(true);
    if (!isChild) {
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
        .catch((message) => {
          toaster.create({
            type: message.type,
            description: message.text,
          });
        })
        .finally(() => setProcessing(false));
    } else {
      axios
        .put("/api/comment/reQuesEdit", {
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
        .catch((message) => {
          toaster.create({
            type: message.type,
            description: message.text,
          });
        })
        .finally(() => setProcessing(false));
    }
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
          onReCommentSaveClick={handleReCommentSave}
        />
      </Stack>
    </Box>
  );
}
