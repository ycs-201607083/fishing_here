import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ToggleTip } from "../../components/ui/toggle-tip";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { CommentContainer } from "../../components/comment/CommentContainer.jsx";

function ImageFileView({ files }) {
  const [selectedImage, setSelectedImage] = useState(null); // 클릭된 이미지 상태 관리

  const handleImageClick = (src) => {
    setSelectedImage(src); // 클릭된 이미지 설정
  };
  // 수정
  const handleBackgroundClick = () => {
    setSelectedImage(null); // 이미지 닫기
  };

  return (
    <>
      {/* 이미지 목록 */}
      <Stack wrap="wrap" spacing={4} alignItems="center">
        {files.map((file) => (
          <Image
            key={file.name}
            src={file.src}
            alt={file.name || "uploaded image"}
            boxSize="250px"
            border="1px solid black"
            objectFit="cover"
            cursor="pointer"
            onClick={() => handleImageClick(file.src)}
          />
        ))}
      </Stack>

      {/* 이미지 확대 */}
      {selectedImage && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.8)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
          onClick={handleBackgroundClick} // 배경 클릭 시 닫기
        >
          <Image
            src={selectedImage}
            alt="Expanded view"
            maxH="90vh"
            maxW="90vw"
            objectFit="contain"
          />
        </Box>
      )}
    </>
  );
}

export function BoardView() {
  const [board, setBoard] = useState(null);
  const { hasAccess, isAuthenticated } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [addr, setAddr] = useState(null);
  const [lati, setLat] = useState(null);
  const [lngi, setLng] = useState(null);
  const { address, lng, lat } = useAddress();
  const [viewCnt, setViewCnt] = useState(null);
  const [like, setLike] = useState({ like: false, count: 0 });
  const [likeTooltipOpen, setLikeTooltipOpen] = useState(false);

  const { number } = useParams();

  useEffect(() => {
    axios
      .get(`/api/board/like/${number}`)
      .then((res) => res.data)
      .then((data) => setLike(data));
  }, []);

  useEffect(() => {
    // 조회수 증가 요청
    // 게시물 데이터 가져오기
    axios
      .post(`/api/board/view/increment/${number}`)
      .then((res) => {
        setViewCnt(res.data.viewCount); // 증가된 조회수 설정
      })
      .catch((e) => {
        console.log("Error fetching board data:", e);
      });
  }, [number]);

  useEffect(() => {
    axios
      .get(`/api/board/view/${number}`)
      .then((res) => res.data)
      .then((data) => {
        setBoard(data);
      });
  }, []);

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

  useEffect(() => {}, [board]);

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

  const handleLikeClick = () => {
    if (isAuthenticated) {
      axios
        .post("/api/board/like", {
          number: number,
        })
        .then((res) => res.data)
        .then((data) => setLike(data))
        .catch()
        .finally();
    } else {
      //tooltip 보여주기
      setLikeTooltipOpen(!likeTooltipOpen);
    }
  };

  return (
    <Box
      mx={"auto"}
      w={{
        md: "60%",
      }}
    >
      <Heading fontSize={"30px"} pb={5} color={"blue.800"}>
        커뮤니티 게시판
      </Heading>

      <Stack>
        <Text fontWeight={"bold"} fontSize={"12px"} pt={8}>
          {board.site}
        </Text>
        <Text fontWeight={"bold"} fontSize={"25px"} pt={1} pb={5}>
          {board.title}
        </Text>
        <Flex pb={30}>
          <Text>작성자 : {board.writer}</Text>
          <Spacer />
          <Text>작성일 : {board.date}</Text>
        </Flex>
        <Flex ml={"85%"} gap={10}>
          <HStack>
            <Box onClick={handleLikeClick}>
              <ToggleTip
                open={likeTooltipOpen}
                content={"로그인 후 좋아요를 클릭해주세요."}
              >
                <Heading>
                  {like.like || <GoHeart color={"red"} />}
                  {like.like && <GoHeartFill color={"red"} />}
                </Heading>
              </ToggleTip>
            </Box>
            <Box>
              <Heading>{like.count}</Heading>
            </Box>
          </HStack>
          <Text>조회수 : {board.viewCount}</Text>
        </Flex>
      </Stack>
      <hr />
      <Stack gap={5} mt={50}>
        <Text>{board.content} </Text>

        {/*포토*/}
        <ImageFileView files={board.fileList} />

        {/*카카오맵*/}
        {board?.kakaoAddress ? (
          <Field alignItems="center">
            <Text>공유 명당 주소 : {board.kakaoAddress.addressName}</Text>
            <Box
              bg={"bg"}
              shadow={"md"}
              borderRadius={"md"}
              borderWidth="2px"
              borderColor="black"
              style={{ width: "50%", height: "300px" }}
              id="map"
            ></Box>
          </Field>
        ) : null}

        {hasAccess(board.writer) && (
          <HStack>
            <Button
              colorPalette={"blue"}
              variant={"ghost"}
              onClick={() => navigate(`/board/edit/${number}`)}
            >
              <Text fontSize={"18px"} fontWeight={"bold"}>
                수정
              </Text>
            </Button>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button colorPalette={"red"} variant={"ghost"}>
                  <Text fontSize={"18px"} fontWeight={"bold"}>
                    삭제
                  </Text>
                </Button>
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
      <hr />
      <CommentContainer boardId={board.number} />
    </Box>
  );
}

export default BoardView;
