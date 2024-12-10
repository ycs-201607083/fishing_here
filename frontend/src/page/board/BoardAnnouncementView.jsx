import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const flushedInputStyles = {
  _focus: {
    borderColor: "gray.200",
    boxShadow: "none",
  },
};

export function BoardAnnouncementView() {
  const { id } = useParams();
  const [annView, setAnnView] = useState(null);

  useEffect(() => {
    axios.get(`/api/board/viewAnn/${id}`).then((res) => {
      setAnnView(res.data);
    });
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

  return (
    <Box mx={"auto"} w={"50%"}>
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
    </Box>
  );
}

export default BoardAnnouncementView;
