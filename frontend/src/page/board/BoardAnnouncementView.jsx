import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "../../components/ui/button.jsx";

const flushedInputStyles = {
  _focus: {
    borderColor: "gray.200",
    boxShadow: "none",
  },
};

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

  const onClickPrev = () => {
    navigate("/board/announcement");
  };
  return (
    <Box mx={"auto"} w={"70%"}>
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
      <Textarea
        readOnly
        resize="none"
        css={inputTheme}
        h="200px"
        value={annView.content}
      />
      <Button onClick={onClickPrev}>
        <FaArrowLeft />
      </Button>
    </Box>
  );
}

export default BoardAnnouncementView;
