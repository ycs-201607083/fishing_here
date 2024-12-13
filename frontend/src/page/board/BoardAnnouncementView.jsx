import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Image,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "../../components/ui/button.jsx";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
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
import { toaster } from "../../components/ui/toaster.jsx";

function ImageFileView({ files }) {
  return (
    <Box>
      {files.map((file) => (
        <Image
          p={5}
          key={file.name}
          src={file.src}
          alt={file.name || "첨부 이미지"}
          maxW={"80%"}
          mx={"auto"}
        />
      ))}
    </Box>
  );
}

export function BoardAnnouncementView() {
  const { id } = useParams();
  const { hasAccess, isAdmin } = useContext(AuthenticationContext);
  const [annView, setAnnView] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/viewAnn/${id}`).then((res) => setAnnView(res.data));
  }, []);

  if (annView === null) {
    return <Spinner />;
  }

  const inputTheme = {
    _focus: {
      borderColor: "gray.200",
      boxShadow: "none",
      outline: "none",
    },
  };

  const handleClickPrev = () => {
    navigate("/board/announcement");
  };

  const handleDelClick = () => {
    axios
      .delete(`/api/board/deleteAnn/${annView.id}`)
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate("/board/announcement");
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
        {annView.title}
      </Text>
      <Flex pb={30}>
        <Text>작성자 : {annView.writer}</Text>
        <Spacer />
        <Text>작성일 : {annView.inserted}</Text>
      </Flex>
      <hr />
      <ImageFileView files={annView.fileList} />
      <Text h="200px">{annView.content}</Text>
      <Flex>
        <Button onClick={handleClickPrev}>
          <FaArrowLeft />
        </Button>
        <Spacer />

        {hasAccess(annView.writer) && (
          <Button
            colorPalette={"blue"}
            variant={"ghost"}
            onClick={() => navigate(`/board/editAnn/${annView.id}`)}
          >
            <Text fontSize={"18px"} fontWeight={"bold"}>
              수정
            </Text>
          </Button>
        )}

        {(hasAccess(annView.writer) || isAdmin) && (
          <DialogRoot placement={"bottom"} role="alertdialog">
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
    </Box>
  );
}

export default BoardAnnouncementView;
