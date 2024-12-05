import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  FormatNumber,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import { CiFileOn } from "react-icons/ci";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select.jsx";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [site, setSite] = useState("");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  console.log(files);

  const handleSaveClick = () => {
    setProgress(true);

    axios
      .postForm("/api/board/add", {
        title,
        content,
        site,
        files,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          description: message.text,
          type: message.type,
        });

        navigate(`/board/view/${data.data.number}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          description: message.text,
          type: message.type,
        });
      })
      .finally(() => {
        // 성공 / 실패 상관 없이 실행
        setProgress(false);
      });
  };

  const disabled = !(title.trim().length > 0 && content.trim().length > 0);

  // files 의 파일명을 component 리스트로 만들기
  const filesList = [];
  let sumOfFileSize = 0;
  let invalidOneFileSize = false; // 한 파일이라도 1MB을 넘는지?
  for (const file of files) {
    sumOfFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }
    filesList.push(
      <Card.Root size={"sm"} key={file.name || file.lastModified}>
        <Card.Body>
          <HStack>
            <CiFileOn style={{ marginRight: "8px" }} />
            <Text
              css={{ color: file.size > 1024 * 1024 ? "red" : "black" }}
              fontWeight={"bold"}
              me={"auto"}
              truncate
            >
              {file.name}
            </Text>
            <Text>
              <FormatNumber
                value={file.size}
                notation={"compact"}
                compactDisplay="short"
              ></FormatNumber>
            </Text>
          </HStack>
        </Card.Body>
      </Card.Root>,
    );
  }

  let fileInputInvalid = false;

  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }

  return (
    <Box
      mx={"auto"}
      w={{
        md: "500px",
      }}
    >
      <MyHeading>게시물 작성</MyHeading>
      <Stack gap={5}>
        <Field label={"제목"}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label={"본문"}>
          <Textarea
            h={250}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>

        <NativeSelectRoot size={"sm"}>
          <NativeSelectField
            placeholder={"민물/바다"}
            value={site}
            onChange={(e) => setSite(e.target.value)}
          >
            <option value={"seaSite"}>바다낚시</option>
            <option value={"riverSite"}>민물낚시</option>
          </NativeSelectField>
        </NativeSelectRoot>

        <Box>
          <Field
            label={"파일"}
            helperText={"총 10MB, 한 파일은 1MB 이내로 선택하세요."}
            invalid={fileInputInvalid}
            errorText={"선택된 파일의 용량이 초과되었습니다."}
          >
            <input
              onChange={(e) => setFiles(e.target.files)}
              type={"file"}
              accept={"image/*"}
              multiple
            />
          </Field>
          <Box my={7}>{filesList}</Box>
        </Box>
        <Box>
          <Button
            disabled={disabled}
            loading={progress}
            onClick={handleSaveClick}
          >
            저장
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
