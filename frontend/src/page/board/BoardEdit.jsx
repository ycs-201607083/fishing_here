import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  FormatNumber,
  HStack,
  Icon,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Switch } from "../../components/ui/switch";
import { CiFileOn, CiTrash } from "react-icons/ci";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { useAddress } from "../../context/AddressContext.jsx";
import { Field } from "../../components/ui/field.jsx";
import BoardKakaoMap from "../../components/map/BoardKakaoMap.jsx";
import { ToggleTip } from "../../components/ui/toggle-tip";
import { toggleContent } from "./BoardAdd.jsx";
import { LuInfo } from "react-icons/lu";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select.jsx";

function ImageView({ files, onRemoveSwitchClick }) {
  const handleImageClick = (src) => {
    setSelectedImage(src); // 클릭한 이미지 설정
    onBig();
  };

  return (
    <HStack>
      {files.map((file) => (
        <HStack key={file.name} my={3}>
          <Box>
            <Switch
              thumbLabel={{
                on: <CiTrash />,
              }}
              colorPalette={"red"}
              onCheckedChange={(e) => onRemoveSwitchClick(e.checked, file.name)}
            />
            <Image
              boxSize="250px" // 원하는 크기로 설정
              border={"1px solid black"}
              src={file.src}
            />
          </Box>
        </HStack>
      ))}
    </HStack>
  );
}

export function BoardEdit() {
  const [board, setBoard] = useState(null);
  const [progress, setProgress] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [checkedSwitch, setCheckedSwitch] = useState(false);
  const [map, setMap] = useState(null);

  //카카오맵 주소, 경도, 위도 가져오기
  const { address, lng, lat, setAddress, setLng, setLat } = useAddress();

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

  const handleSaveClick = () => {
    setProgress(true);

    axios
      .putForm(`/api/board/update`, {
        number: board.number,
        title: board.title,
        content: board.content,
        site: board.site,
        removeFiles,
        uploadFiles,
        addressName: address,
        addressLng: lng,
        addressLat: lat,
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });

        navigate(`/board/view/${number}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        console.log("edit error", e);
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

  useEffect(() => {
    console.log("board.kakaoAddress:", board?.kakaoAddress);
    if (!board || !board.kakaoAddress) return; // board가 로드되기 전에 실행되지 않도록

    const { addressName, addressLat, addressLng } = board.kakaoAddress;

    // 카카오맵 불러오기
    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(addressLat, addressLng),
        level: 3,
        draggable: false,
      };

      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);

      const newCenter = new kakao.maps.LatLng(addressLat, addressLng);
      mapInstance.panTo(newCenter);

      //마커생성
      const markerPosition = new window.kakao.maps.LatLng(
        addressLat,
        addressLng,
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(mapInstance);
    });
  }, [board]); // board가 변경될 때마다 실행

  //board가 null일 때 첫 렌더
  if (board === null) {
    return <Spinner />;
  }

  //파일의 용량이 크다면 true, true일때 저장안됨
  let fileInputInvalid = false;

  let sumOfFileSize = 0;
  let invalidOneFileSize = false; // 한 파일이라도 1MB을 넘는지?
  for (const file of uploadFiles) {
    sumOfFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }
  }

  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }

  //제목이나 본문이 비었는 지 확인
  const disabled = !(
    board.title.trim().length > 0 &&
    board.content.trim().length > 0 &&
    !fileInputInvalid &&
    board.site
  );

  //스위치 true 일때 카카오맵 열기
  const handleKakaoMapChecked = (event) => {
    const checked = event.target.checked;
    console.log(checked);
    setCheckedSwitch(checked);
  };

  console.log(
    "수정된 주소 = ",
    address,
    "수정된 경도 = ",
    lat,
    "수정된 위도 = ",
    lng,
  );

  return (
    <Box
      mx={"auto"}
      w={{
        md: "80%",
      }}
    >
      <MyHeading>{number}번 게시물 수정</MyHeading>
      <Stack gap={5}>
        <label>
          <p>수정할 제목</p>
          <Input
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </label>
        <label>
          <p>수정할 내용</p>
          <Textarea
            h={400}
            resize={"none"}
            value={board.content}
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
          />
        </label>

        <label>
          <p>낚시 종류</p>
          <NativeSelectRoot size={"sm"}>
            <NativeSelectField
              placeholder={"낚시 종류를 선택 해주세요."}
              value={board.site}
              onChange={(e) => setBoard({ ...board, site: e.target.value })}
            >
              <option value={"바다낚시"}>바다낚시</option>
              <option value={"민물낚시"}>민물낚시</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </label>

        <ImageView
          files={board.fileList}
          onRemoveSwitchClick={handleRemoveSwitchClick}
        />
        <Box>
          <Box>
            <label>
              <p>수정할 파일</p>
              <input
                onChange={(e) => setUploadFiles(e.target.files)}
                type={"file"}
                multiple
                accept={"image/*"}
              />
            </label>
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

        <Switch
          checked={checkedSwitch}
          onChange={handleKakaoMapChecked}
          colorPalette={"blue"}
        >
          <p>
            자신의 명당 맵으로 공유하기
            <ToggleTip content={toggleContent}>
              <Button variant={"ghost"}>
                <LuInfo />
              </Button>
            </ToggleTip>
          </p>
        </Switch>

        {/*카카오맵*/}
        <VStack justify="space-around">
          {checkedSwitch && (
            <Field justify={"left"}>
              <Text>수정할 명당 주소 : {address}</Text>
              <Box
                w={"100%"}
                bg={"bg"}
                shadow={"md"}
                borderRadius={"md"}
                borderWidth="2px"
                borderColor="blue"
              >
                <BoardKakaoMap />
              </Box>
            </Field>
          )}

          {board?.kakaoAddress ? (
            <Field>
              <Text>현재 명당 주소 : {board.kakaoAddress.addressName}</Text>
              <Box
                bg={"bg"}
                shadow={"md"}
                borderRadius={"md"}
                borderWidth="10px"
                borderColor="red"
                style={{ width: "100%", height: "400px" }}
                id="map"
              />
            </Field>
          ) : null}
        </VStack>

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
                  <p>{board.number}번 게시물을 수정하시겠습니까?</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button
                    isLoading={progress}
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
