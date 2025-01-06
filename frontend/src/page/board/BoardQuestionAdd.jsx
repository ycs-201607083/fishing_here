import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import {
  Box,
  Card,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";

export function BoardQuestionAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  const handleSaveButton = () => {
    setProgress(true);

    axios
      .postForm("/api/ques/questionAdd", { title, content, files })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        const id = data.data.id;
        toaster.create({ type: message.type, description: message.text });
        navigate(`/ques/questionView/${id}`);
      })
      .catch((e) => {
        console.log(e);
        const message = e.response.message;
        toaster.create({ type: message.type, description: message.text });
      })
      .finally(() => setProgress(false));
  };

  //files 의 파일명 component 리스트로 만들기
  const fileList = [];
  let sumOfFileSize = 0;
  let invalidOneFileSize = false; // 1MB 넘는지 체크

  for (const file of files) {
    sumOfFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }

    fileList.push(
      <Card.Root size={"sm"} key={file.name || file.lastModified}>
        <Card.Body>
          <HStack>
            <Text
              css={{ color: file.size > 1024 * 1024 ? "red" : "black" }}
              fontWeight={"bold"}
              me={"auto"}
              truncate
            >
              {file.name}
            </Text>
            <Text>{Math.floor(file.size / 1024)} KB</Text>
          </HStack>
        </Card.Body>
      </Card.Root>,
    );
  }

  //파일 용량체크
  let filedInputInvalid = false;
  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    filedInputInvalid = true;
  }
  const disabled = !(title.trim().length > 0 && content.trim().length > 0);
  return (
    <Box maxW={"70%"} mx={"auto"}>
      <Stack gap={5}>
        <Field label="제목">
          <Input
            value={title}
            placeholder="제목을 입력해 주세요"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="본문">
          <Textarea
            value={content}
            placeholder="내용을 입력해 주세요"
            h={"300px"}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>
        <Field
          label={"파일"}
          helperText={"총 10MB, 한 파일은 1MB 이내로 선택하세요."}
          errorText={"선택된 파일의 용량이 초과되었습니다."}
          invalid={filedInputInvalid}
        >
          <Box>
            <input
              type={"file"}
              onChange={(e) => setFiles(e.target.files)}
              accept={"image/*"}
              multiple
            />
          </Box>
          <Box>{fileList}</Box>
        </Field>
      </Stack>
      <Box my={7}></Box>
      <Button disabled={disabled} loading={progress} onClick={handleSaveButton}>
        저장
      </Button>
    </Box>
  );

  return null;
}
