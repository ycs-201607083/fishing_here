import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import {
  Box,
  Card,
  Flex,
  HStack,
  Input,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { ImagDeleteView } from "../../components/root/ImagDeleteView.jsx";
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

export function BoardQuestionEdit() {
  const { id } = useParams();
  const { hasAccess } = useContext(AuthenticationContext);
  const [question, setQuestion] = useState(null);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/board/questionView/${id}`)
      .then((res) => {
        setQuestion(res.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveClick = () => {
    setProgress(true);
    axios
      .putForm("/api/board/updateQuestion", {
        id: question.id,
        title: question.title,
        content: question.content,
        uploadFiles,
        removeFiles,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/board/questionView/${id}`);
      })
      .catch((e) => {
        const message = e.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProgress(false);
      });
  };

  if (loading) {
    return <Spinner />;
  }

  const handleRemoveClick = (checked, fileName) => {
    if (checked) {
      setRemoveFiles([...removeFiles, fileName]);
      console.log(fileName);
    } else {
      setRemoveFiles(removeFiles.filter((f) => f !== fileName));
    }
  };

  let disabled = false;
  if (question !== null) {
    disabled = !(
      question.title.trim().length > 0 && question.content.trim().length > 0
    );
  }

  //files 의 파일명 component 리스트로 만들기
  const fileList = [];
  let sumOfFileSize = 0;
  let invalidOneFileSize = false; // 1MB 넘는지 체크

  for (const file of uploadFiles) {
    sumOfFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }

    fileList.push(
      <Card.Root size={"sm"} maxW={"40%"} key={file.name || file.lastModified}>
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

  if (question === null) {
    return <Spinner />;
  }
  return (
    <Box maxW={"70%"} mx={"auto"}>
      <Stack gap={5}>
        <Field label="제목">
          <Input
            value={question.title}
            placeholder="제목을 입력해 주세요"
            onChange={(e) =>
              setQuestion({ ...question, title: e.target.value })
            }
          />
        </Field>
        <ImagDeleteView
          files={question.fileList}
          onRemoveSwitchClick={handleRemoveClick}
        />
        <Field label="본문">
          <Textarea
            value={question.content}
            placeholder="내용을 입력해 주세요"
            h={"300px"}
            onChange={(e) =>
              setQuestion({ ...question, content: e.target.value })
            }
          />
        </Field>
        <Box>
          <Field
            label={"추가 파일 선택"}
            helperText={"총 10MB, 한 파일은 1MB 이내로 선택하세요."}
            errorText={"선택된 파일의 용량이 초과되었습니다."}
            invalid={filedInputInvalid}
          >
            <input
              type={"file"}
              multiple
              accept={"image/*"}
              onChange={(e) => setUploadFiles(e.target.files)}
            />
          </Field>
        </Box>
        <Box pb={5}>{fileList}</Box>
      </Stack>
      <Flex pb={5}>
        <Button onClick={() => navigate(`/board/viewAnn/${id}`)}>
          <FaArrowLeft />
        </Button>
        <Spacer />

        {hasAccess(question.writer) && (
          <DialogRoot placement={"bottom"} role="alertdialog">
            <DialogTrigger asChild>
              <Button
                colorPalette={"blue"}
                variant={"ghost"}
                disabled={disabled}
              >
                <Text fontSize={"18px"} fontWeight={"bold"}>
                  저장
                </Text>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>저장여부 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Text>저장하시겠습니까?</Text>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button colorPalette={"red"}>
                    <Text fontSize={"18px"}>취소</Text>
                  </Button>
                </DialogActionTrigger>
                <Button
                  loading={progress}
                  colorPalette={"blue"}
                  variant={"outline"}
                  onClick={handleSaveClick}
                >
                  <Text fontSize={"18px"}>저장</Text>
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
        )}
      </Flex>
    </Box>
  );

  return null;
}
