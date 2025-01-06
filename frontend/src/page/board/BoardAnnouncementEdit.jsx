import React, { useContext, useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { FaArrowLeft } from "react-icons/fa6";
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
import { ImagDeleteView } from "../../components/root/ImagDeleteView.jsx";

export function BoardAnnouncementEdit() {
  const { id } = useParams();
  const { hasAccess } = useContext(AuthenticationContext);
  const [announcement, setAnnouncement] = useState(null);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/ann/viewAnn/${id}`)
      .then((res) => {
        setAnnouncement(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveClick = () => {
    setProgress(true);
    axios
      .putForm("/api/ann/updateAnn", {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
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
        navigate(`/ann/viewAnn/${id}`);
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
  if (announcement !== null) {
    disabled = !(
      announcement.title.trim().length > 0 &&
      announcement.content.trim().length > 0
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

  if (announcement === null) {
    return <Spinner />;
  }
  return (
    <Box maxW={"70%"} mx={"auto"}>
      <Stack gap={5}>
        <Field label="제목">
          <Input
            value={announcement.title}
            placeholder="제목을 입력해 주세요"
            onChange={(e) =>
              setAnnouncement({ ...announcement, title: e.target.value })
            }
          />
        </Field>
        <ImagDeleteView
          files={announcement.fileList}
          onRemoveSwitchClick={handleRemoveClick}
        />
        <Field label="본문">
          <Textarea
            value={announcement.content}
            placeholder="내용을 입력해 주세요"
            h={"300px"}
            onChange={(e) =>
              setAnnouncement({ ...announcement, content: e.target.value })
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
        <Button onClick={() => navigate(`/ann/viewAnn/${id}`)}>
          <FaArrowLeft />
        </Button>
        <Spacer />

        {hasAccess(announcement.writer) && (
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
}

export default BoardAnnouncementEdit;
