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
import { Switch } from "../../components/ui/switch";
import { KakaoMap } from "../../components/map/KakaoMap.jsx";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [site, setSite] = useState("");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();
  const [checkedSwitch, setCheckedSwitch] = useState(false);

  //스위치 true 일때 카카오맵 열기
  const handleKakaoMapChecked = (event) => {
    const checked = event.target.checked;
    setCheckedSwitch(checked);
  };

  //뒤로가기 버튼 눌렀을때 alert 띄우기
  const handleBackClick = () => {
    if (confirm("입력한 정보는 저장되지 않습니다.\n게시판으로 이동 할까요?")) {
      navigate("/board/list");
    }
  };

  //게시글 정보 저장
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

        if (site === "seaSite") {
        } else {
        }

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

  const disabled = !(
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    site
  );
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

  //파일의 용량이 크다면 true, true일때 저장안됨
  let fileInputInvalid = false;

  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }

  return (
    <Box
      mx={"auto"}
      w={{
        md: "80%",
      }}
    >
      <MyHeading>게시물 작성</MyHeading>
      <Stack gap={5}>
        <Field label={"제목"}>
          <Input
            w={"100%"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label={"본문"}>
          <Textarea
            resize={"none"}
            h={400}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>

        <NativeSelectRoot size={"sm"}>
          <NativeSelectField
            placeholder={"낚시 종류를 선택 해주세요."}
            value={site}
            onChange={(e) => {
              setSite(e.target.value);
            }}
          >
            <option value={"민물낚시"}>바다낚시</option>
            <option value={"바다낚시"}>민물낚시</option>
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
        <Stack>
          <Switch
            checked={checkedSwitch}
            onChange={handleKakaoMapChecked}
            colorPalette={"blue"}
          >
            자신의 명당을 맵으로 공유하기
          </Switch>

          {/* 지도 */}
          {checkedSwitch && <KakaoMap />}
        </Stack>
        <Stack direction={"row"} mb={4}>
          <Box>
            <Button
              w={100}
              disabled={disabled}
              loading={progress}
              onClick={handleSaveClick}
            >
              저장
            </Button>
          </Box>
          <Box>
            <Button w={100} onClick={handleBackClick}>
              돌아가기
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
