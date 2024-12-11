import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Input,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Checkbox } from "../../components/ui/checkbox.jsx";

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
  const [announcement, setAnnouncement] = useState(null);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/board/viewAnn/${id}`)
      .then((res) => {
        setAnnouncement(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveClick = () => {
    // axios.putForm("api/board/updateAnn", {
    //   id: announcement.id,
    //   title: announcement.title,
    //   content: announcement.content,
    // });
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
      </Stack>
    </Box>
  );
}

export default BoardAnnouncementEdit;
