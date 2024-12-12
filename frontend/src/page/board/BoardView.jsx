import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  HStack,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
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
import { toaster } from "../../components/ui/toaster.jsx";
import { useAddress } from "../../context/AddressContext.jsx";
import { CommentContainer } from "../../components/comments/CommentContainer.jsx";

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
          boxSize="500px" // 원하는 크기로 설정
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
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [addr, setAddr] = useState(null);
  const [lati, setLat] = useState(null);
  const [lngi, setLng] = useState(null);
  const { address, lng, lat } = useAddress();

  useEffect(() => {
    axios
      .get(`/api/board/view/${number}`)
      .then((res) => {
        console.log(res.data);
        setBoard(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [number]);

  useEffect(() => {
    setAddr(address);
    setLng(lng);
    setLat(lat);
  }, [addr, lati, lngi]);

  useEffect(() => {
    console.log("board.kakaoAddress:", board?.kakaoAddress);
    if (!board || !board.kakaoAddress) return; // board가 로드되기 전에 실행되지 않도록

    const { addressLat, addressLng } = board.kakaoAddress;

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

      // 지도 중심 강제 이동
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

  if (board === null) {
    return (
      <Box>
        <p>존재하지 않는 페이지 입니다.</p>
        <p>메인 페이지로 넘어갑니다..</p>
        <Spinner />
      </Box>
    );
  }

  const handleDeleteClick = () => {
    axios
      .delete(`/api/board/delete/${number}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/board/list");
      });
  };

  return (
    <Box
      mx={"auto"}
      w={{
        md: "80%",
      }}
    >
      <Flex>
        <MyHeading me={"auto"}>{number} 번 게시물</MyHeading>
      </Flex>
      <Stack gap={5}>
        <Field label="제목" readOnly>
          <Input value={board.title} />
        </Field>
        <Field label="내용" readOnly>
          <Textarea resize={"none"} h={400} value={board.content} />
        </Field>

        {/*포토*/}
        <ImageFileView files={board.fileList} />

        {/*카카오맵*/}

        {board?.kakaoAddress ? (
          <Field>
            <Text>공유 명당 주소 : {board.kakaoAddress.addressName}</Text>
            <Box
              bg={"bg"}
              shadow={"md"}
              borderRadius={"md"}
              borderWidth="2px"
              borderColor="black"
              style={{ width: "100%", height: "400px" }}
              id="map"
            ></Box>
          </Field>
        ) : null}

        <Field label="작성자" readOnly>
          <Input value={board.writer} />
        </Field>
        <Field label="낚시 종류" readOnly>
          <Input value={board.site} />
        </Field>
        <Field label="작성일시" readOnly>
          <Input value={board.date} />
        </Field>

        {hasAccess(board.writer) && (
          <HStack>
            <Button
              colorPalette={"cyan"}
              onClick={() => navigate(`/board/edit/${board.number}`)}
            >
              수정
            </Button>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button colorPalette={"red"}>삭제</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>삭제 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{number}번 게시물을 삭제 할까요?</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button colorPalette={"red"} onClick={handleDeleteClick}>
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </HStack>
        )}
        <hr />
      </Stack>

      <CommentContainer boardId={board.id} />
    </Box>
  );
}

export default BoardView;
