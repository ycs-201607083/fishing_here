import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Input, Spinner, Stack, Textarea } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { Field } from "../../components/ui/field.jsx";

function ImageFileView({ files }) {
  return (
    <Box>
      {files.map((file) => (
        <Image
          key={file.name}
          src={file.src}
          my={3}
          border={"1px solid black"}
        />
      ))}
    </Box>
  );
}

export function BoardView() {
  const [board, setBoard] = useState(null);
  const { number } = useParams();
  const { hasAccess, isAuthenticated } = useContext(AuthenticationContext);

  useEffect(() => {
    axios
      .get(`/api/board/view/${number}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  if (board === null) {
    <Spinner />;
  }

  return (
    <Box
      mx={"auto"}
      w={{
        md: "500px",
      }}
    >
      <Flex>
        <MyHeading me={"auto"}>{number} 번 게시물</MyHeading>
      </Flex>
      <Stack gap={5}>
        <Field label="제목" readOnly>
          <Input value={board.title} />
        </Field>
        <Field label="본문" readOnly>
          <Textarea h={250} value={board.content} />
        </Field>
        <Field label="작성자" readOnly>
          <Input value={board.writer} />
        </Field>
        <Field label="낚시 종류" readOnly>
          <Input value={board.site} />
        </Field>
      </Stack>
    </Box>
  );
}

export default BoardView;
