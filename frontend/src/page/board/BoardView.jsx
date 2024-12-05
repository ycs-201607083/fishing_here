import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Image,
  Input,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
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
          alt={file.name || "uploaded image"}
          my={3}
          border="1px solid black"
          boxSize="300px" // 원하는 크기로 설정
          objectFit="cover" // 이미지의 표시 방법
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
        console.log("res.data?=", res.data);
        setBoard(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  if (board === null) {
    return <Spinner />;
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
        <ImageFileView files={board.fileList} />
        <Field label="작성자" readOnly>
          <Input value={board.writer} />
        </Field>
        <Field label="낚시 종류" readOnly>
          <Input value={board.site} />
        </Field>
        <Field label="작성일시" readOnly>
          <Input value={board.date} />
        </Field>
      </Stack>
    </Box>
  );
}

export default BoardView;
