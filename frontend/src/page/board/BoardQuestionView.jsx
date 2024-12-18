import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import axios from "axios";
import { Box, Flex, Heading, Spacer, Spinner, Text } from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster.jsx";
import { Button } from "../../components/ui/button.jsx";
import { FaArrowLeft } from "react-icons/fa6";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { ImageFileView } from "../../components/root/ImageFileView.jsx";
import { QuesCommentContainer } from "../../components/comment/QuesCommentContainer.jsx";

export function BoardQuestionView() {
  const { id } = useParams();
  const { hasAccess, isAdmin } = useContext(AuthenticationContext);
  const [question, setQuestion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/questionView/${id}`).then((res) => {
      setQuestion(res.data);
    });
  }, []);

  if (question === null) {
    return <Spinner />;
  }

  const handleClickPrev = () => {
    navigate("/board/question");
  };

  const handleDelClick = () => {
    axios
      .delete(`/api/board/deleteQues/${question.id}`)
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate("/board/question");
      })
      .catch((e) => {
        const message = e.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  };

  return (
    <Box mx={"auto"} w={"60%"}>
      <Heading fontSize={"30px"} pb={5} color={"blue.800"}>
        공지사항
      </Heading>
      <hr />
      <Text fontWeight={"bold"} fontSize={"20px"} pt={10} pb={5}>
        {question.title}
      </Text>
      <Flex pb={30}>
        <Text>작성자 : {question.writer}</Text>
        <Spacer />
        <Text>작성일 : {question.inserted}</Text>
      </Flex>
      <hr />
      <ImageFileView files={question.fileList || []} />
      <Text h="200px">{question.content}</Text>
      <Flex>
        <Button onClick={handleClickPrev}>
          <FaArrowLeft /> 목록
        </Button>
        <Spacer />

        {hasAccess(question.writer) && (
          <Button
            colorPalette={"blue"}
            variant={"ghost"}
            onClick={() => navigate(`/board/questionEdit/${question.id}`)}
          >
            <Text fontSize={"18px"} fontWeight={"bold"}>
              수정
            </Text>
          </Button>
        )}

        {(hasAccess(question.writer) || isAdmin) && (
          <DialogRoot placement={"center"} role="alertdialog">
            <DialogTrigger asChild>
              <Button colorPalette={"red"} variant={"ghost"}>
                <Text fontSize={"18px"} fontWeight={"bold"}>
                  삭제
                </Text>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>삭제 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Text>삭제하시겠습니까?</Text>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button colorPalette={"blue"}>
                    <Text fontSize={"18px"}>취소</Text>
                  </Button>
                </DialogActionTrigger>
                <Button
                  colorPalette={"red"}
                  variant={"outline"}
                  onClick={handleDelClick}
                >
                  <Text fontSize={"18px"}>삭제</Text>
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
        )}
      </Flex>
      <QuesCommentContainer quesId={question.id} writer={question.writer} />
    </Box>
  );
}
