import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
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
import { Checkbox } from "../../components/ui/checkbox.jsx";
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

function ImageView({ files, onRemoveSwitchClick }) {
  // 체크 상태를 관리할 state 추가
  const [blurredImages, setBlurredImages] = useState({});

  const handleCheckboxChange = (isChecked, fileName) => {
    setBlurredImages((prev) => ({
      ...prev,
      [fileName]: isChecked, // 이미지의 blur 상태를 업데이트
    }));
    onRemoveSwitchClick(isChecked, fileName); // 기존 콜백 호출
  };

  return (
    <Box maxW={"70%"} mx={"auto"}>
      {files.map((file) => (
        <Flex key={file.name} align="center">
          <Image
            src={file.src}
            w={"30%"}
            style={{
              filter: blurredImages[file.name] ? "blur(4px)" : "none", // 흐림 효과 추가
              transition: "filter 0.3s", // 부드러운 전환 효과
            }}
          />
          <Checkbox
            invalid
            pl={3}
            onChange={(e) => handleCheckboxChange(e.target.checked, file.name)}
          >
            삭제
          </Checkbox>
        </Flex>
      ))}
    </Box>
  );
}

export function BoardAnnouncementEdit() {
  const { id } = useParams();
  const { hasAccess } = useContext(AuthenticationContext);
  const [announcement, setAnnouncement] = useState(null);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const naviagte = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/board/viewAnn/${id}`)
      .then((res) => {
        setAnnouncement(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveClick = () => {
    setProgress(true);
    axios
      .putForm("/api/board/updateAnn", {
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
        naviagte(`/board/viewAnn/${id}`);
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

  return (
    <Box maxW={"70%"} mx={"auto"}>
      <Stack gap={5}>
        <Field label="제목">
          <Input
            readOnly
            value={announcement.title}
            placeholder="제목을 입력해 주세요"
            onChange={(e) =>
              setAnnouncement({ ...announcement, title: e.target.value })
            }
          />
        </Field>
        <ImageView
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
          <Field label={"추가 파일 선택"}>
            <input
              type={"file"}
              multiple
              accept={"image/*"}
              onChange={(e) => setUploadFiles(e.target.files)}
            />
          </Field>
        </Box>
        <Box pb={5}>
          {Array.from(uploadFiles).map((file) => (
            <li key={file.name}>
              {file.name}({Math.floor(file.size / 1024)}kb)
            </li>
          ))}
        </Box>
      </Stack>
      <Flex pb={5}>
        <Button onClick={() => naviagte(`/board/viewAnn/${id}`)}>
          <FaArrowLeft />
        </Button>
        <Spacer />

        {hasAccess(announcement.writer) && (
          <DialogRoot placement={"bottom"} role="alertdialog">
            <DialogTrigger asChild>
              <Button colorPalette={"blue"} variant={"ghost"}>
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
