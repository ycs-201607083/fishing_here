import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
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
import { ToggleTip } from "../../components/ui/toggle-tip";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { CommentContainer } from "../../components/comment/CommentContainer.jsx";

// 차트 임포트
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

// 차트에 필요한 요소를 등록.
ChartJS.register(ArcElement, Tooltip, Legend);

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
      <Stack direction="row" wrap="wrap" spacing={4}>
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

/*---------------- 차트 설정 -------------------*/
function ChartView({ chartData }) {
  if (chartData.labels.length === 0) {
    return <Box>차트 데이터가 없습니다.</Box>;
  }
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        backgroundColor: ["red", "blue", "yellow", "green", "purple"],
        hoverOffset: 4,
      },
    ],
  };
  return <Doughnut data={data} />;
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

  // ------------- 차트 데이터 추가 --------------
  const [chartData, setChartData] = useState({ labels: [], values: [] });

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
      .then(() => {
        // 조회수 증가 후 게시물 데이터 로드
        return axios.get(`/api/board/view/${number}`);
      })
      .then((res) => {
        setBoard(res.data); // 게시물 데이터 설정
        setViewCnt(res.data.viewCount); // 증가된 조회수 설정
      })
      .catch((e) => {
        console.log("Error fetching board data:", e);
      });
  }, [number]);

  //------------ 차트 데이터 관리--------------
  useEffect(() => {
    axios
      .get(`/api/chart/${number}`)
      .then((res) => {
        setChartData(res.data); // 서버에서 받은 데이터로 차트 업데이트
      })
      .catch((e) => console.error("Failed to fetch chart data:", e));
  }, [number]);

  // ----------- 새로운 차트 데이터 저장---------
  const handleChartSave = (chartLabel, chartValue) => {
    axios
      .post(`/api/chart/add`, {
        boardId: number,
        label: chartLabel,
        value: chartValue,
      })
      .then(() => {
        // 차트 데이터를 갱신
        setChartData((prev) => ({
          labels: [...prev.labels, chartLabel],
          values: [...prev.values, chartValue],
        }));
        console.log("Chart data saved successfully.");
      })
      .catch((e) => console.error("Failed to save chart data:", e));
  };

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
        md: "80%",
      }}
    >
      <Flex>
        <MyHeading me={"auto"}>{number} 번 게시물</MyHeading>
        <HStack>
          <Box onClick={handleLikeClick}>
            <ToggleTip
              open={likeTooltipOpen}
              content={"로그인 후 좋아요를 클릭해주세요."}
            >
              <Heading>
                {like.like || <GoHeart />}
                {like.like && <GoHeartFill />}
              </Heading>
            </ToggleTip>
          </Box>
          <Box>
            <Heading>{like.count}</Heading>
          </Box>
        </HStack>
      </Flex>
      <Field>조회수:{board.viewCount}</Field>
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

        {/* 차트 추가 */}
        <Field label="명당 어종별 어획량 차트">
          <ChartView chartData={chartData} />
        </Field>

        {/* 차트 데이터 입력 UI */}
        <Field label="어획량 데이터 추가">
          <Input
            placeholder="해산물 입력"
            onChange={(e) => setChartLabel(e.target.value)}
          />
          <Input
            placeholder="실제 잡은 해산물 수 입력"
            type="number"
            onChange={(e) => setChartValue(e.target.value)}
          />
          <Button
            colorPalette="blue"
            onClick={() => handleChartSave(chartLabel, chartValue)}
          >
            차트 저장
          </Button>
        </Field>

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
              onClick={() => navigate(`/board/edit/${number}`)}
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
      <hr />
      <CommentContainer boardId={board.number} />
    </Box>
  );
}

export default BoardView;
