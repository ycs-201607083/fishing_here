import React, { useEffect, useState } from "react";
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
  Textarea,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "../../components/ui/button.jsx";

function ImageFileView({ files }) {
  return (
    <Box>
      {files.map((file) => (
        <Image
          key={file.name}
          src={file.src}
          alt={file.name || "첨부 이미지"}
          maxW={"500px"}
          mx={"auto"}
        />
      ))}
    </Box>
  );
}

export function BoardAnnouncementView() {
  const { id } = useParams();
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
  const handleEditClick = () => {};
  const handleDelClick = () => {};
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
      <Textarea
        readOnly
        resize="none"
        css={inputTheme}
        h="200px"
        value={annView.content}
      />
      <Flex>
        <Button onClick={handleClickPrev}>
          <FaArrowLeft />
        </Button>
        <Spacer />
        <Button
          colorPalette={"blue"}
          variant={"ghost"}
          onClick={handleEditClick}
        >
          수정
        </Button>
        <Button colorPalette={"red"} variant={"ghost"} onClick={handleDelClick}>
          삭제
        </Button>
      </Flex>
    </Box>
  );
}

export default BoardAnnouncementView;
