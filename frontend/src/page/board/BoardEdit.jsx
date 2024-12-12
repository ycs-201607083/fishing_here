import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Field,
  FormatNumber,
  HStack,
  Icon,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Switch } from "../../components/ui/switch";
import { CiFileOn, CiTrash } from "react-icons/ci";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { MyHeading } from "../../components/root/MyHeading.jsx";

function ImageView({ files, onRemoveSwitchClick }) {
  return (
    <Box>
      {files.map((file) => (
        <HStack key={file.name} my={3}>
          <Switch
            thumbLabel={{
              on: <CiTrash />,
            }}
            colorPalette={"red"}
            onCheckedChange={(e) => onRemoveSwitchClick(e.checked, file.name)}
          />
          <Box>
            <Image border={"1px solid black"} src={file.src} />
          </Box>
        </HStack>
      ))}
    </Box>
  );
}

export function BoardEdit() {
  const [board, setBoard] = useState(null);
  const [progress, setProgress] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);

  const { hasAccess } = useContext(AuthenticationContext);

  const { number } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/board/view/${number}`)
      .then((res) => setBoard(res.data))
      .catch((error) => console.error("API 에러:", error));
  }, []);

  const handleRemoveSwitchClick = (checked, fileName) => {
    if (checked) {
      setRemoveFiles([...removeFiles, fileName]);
    } else {
      setRemoveFiles(removeFiles.filter((f) => f !== fileName));
    }
  };

  console.log("지울파일목록", removeFiles);

  const handleSaveClick = () => {
    setProgress(true);

    axios
      .putForm("/api/board/update", {
        number: board.number,
        title: board.title,
        content: board.content,
        removeFiles,
        uploadFiles,
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate(`/board/view/${board.number}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProgress(false);
        setDialogOpen(false);
      });
  };
  //board가 null일 때 첫 렌더
  if (board === null) {
    return <Spinner />;
  }

  //제목이나 본문이 비었는 지 확인
  const disabled = !(
    board.title.trim().length > 0 && board.content.trim().length > 0
  );

  return (
    <Box
      mx={"auto"}
      w={{
        md: "500px",
      }}
    >
      <MyHeading>{number}번 게시물 수정</MyHeading>
      <Stack gap={5}>
        <Field label={"제목"}>
          <Input
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </Field>
        <Field label={"내용"}>
          <Textarea
            h={250}
            value={board.content}
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
          />
        </Field>
        <ImageView
          files={board.fileList}
          onRemoveSwitchClick={handleRemoveSwitchClick}
        />
        <Box>
          <Box>
            <Field label={"파일 업로드"}>
              <input
                onChange={(e) => setUploadFiles(e.target.files)}
                type={"file"}
                multiple
                accept={"image/*"}
              />
            </Field>
          </Box>
          <Box>
            {Array.from(uploadFiles).map((file) => (
              <Card.Root size={"sm"}>
                <Card.Body>
                  <HStack>
                    <Text
                      css={{ color: file.size > 1024 * 1024 ? "red" : "black" }}
                      fontWeight={"bold"}
                      me={"auto"}
                      truncate
                    >
                      <Icon>
                        <CiFileOn />
                      </Icon>
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
              </Card.Root>
            ))}
          </Box>
        </Box>

        {hasAccess(board.writer) && (
          <Box>
            <DialogRoot
              open={dialogOpen}
              onOpenChange={(e) => setDialogOpen(e.open)}
            >
              <DialogTrigger asChild>
                <Button disabled={disabled} colorPalette={"blue"}>
                  저장
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>저장 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{board.number}번 게시물을 수정 하시겠습니까?</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button varinat={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button
                    loading={progress}
                    colorPalette={"blue"}
                    onClick={handleSaveClick}
                  >
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
