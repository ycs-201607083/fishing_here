import {
  Box,
  Group,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Field } from "../ui/field.jsx";
import { Button } from "../ui/button.jsx";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { kakao } = window;

export function KakaoMap() {
  const [map, setMap] = useState(null);
  const [keyWord, setKeyWord] = useState(""); // 검색어
  const [isOpen, setIsOpen] = useState(false);
  const [searchService, setSearchService] = useState(null); // 장소 검색 서비스
  const [markers, setMarkers] = useState([]); // 마커 관리
  const [infoWindows, setInfoWindows] = useState([]); // InfoWindow 관리
  const [places, setPlaces] = useState([]); // 검색 결과 데이터 저장
  const [addressList, setAddressList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 지도 초기화
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.556535, 126.945108),
      level: 3,
    };
    const mapInstance = new kakao.maps.Map(container, options);
    // 장소 검색 초기화
    const ps = new kakao.maps.services.Places();

    setMap(mapInstance);
    setSearchService(ps);
  }, []);

  useEffect(() => {
    axios
      .get("/api/board/fishingAddress")
      .then((res) => res.data)
      .then((data) => {
        console.log(data, "낚시터");
        setAddressList(data);
      })
      .catch(() => {
        console.log("안됨");
      });
  }, []);

  function clearMarkersAndInfoWindows() {
    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));
    infoWindows.forEach((infoWindow) => infoWindow.close());
    setMarkers([]);
    setInfoWindows([]);
  }

  const handleShareFishingAddress = () => {
    setKeyWord("공유 낚시터"); // 키워드 설정
    setIsOpen(true); // 목록 열기
    setPlaces(addressList); // 공유 낚시터 데이터를 검색 결과로 설정

    clearMarkersAndInfoWindows();

    if (addressList && addressList.length > 0) {
      const newMarkers = [];
      const newInfoWindows = [];
      const bounds = new kakao.maps.LatLngBounds(); // 검색 결과 범위

      addressList.forEach((address) => {
        if (
          address.lat &&
          address.lng &&
          !isNaN(address.lat) &&
          !isNaN(address.lng)
        ) {
          const markerPosition = new kakao.maps.LatLng(
            address.lat,
            address.lng,
          );

          const marker = new kakao.maps.Marker({
            position: markerPosition,
            map: map,
          });
          newMarkers.push(marker);

          // InfoWindow 생성
          const infoWindow = new kakao.maps.InfoWindow({
            content: `
          <div style="padding: 5px;
                      background-color: #ff3d00; color: white; 
                      font-size: 14px;
                      white-space: nowrap;">
            <a href="/board/view/${address.number}">
                <b style="font-size:16px">${address.number} 번 게시글</b>       
            </a>
          </div>
          <div style="padding: 10px; white-space: nowrap;">
            <b>${address.name}</b>
          </div>
        `,
          });
          newInfoWindows.push(infoWindow);

          // 마커 클릭 이벤트 등록
          kakao.maps.event.addListener(marker, "click", () => {
            newInfoWindows.forEach((iw) => iw.close()); // 모든 InfoWindow 닫기
            infoWindow.open(map, marker); // 현재 마커 InfoWindow 열기
          });
          bounds.extend(markerPosition); // 범위 확장
        } else {
          console.log("없음", address);
        }
      });
      setMarkers(newMarkers);
      setInfoWindows(newInfoWindows);
      // map.setLevel(13);
      map.setBounds(bounds); // 지도 범위 확장 = 마커주소값이 너무 많아서 작동이안됨
    } else {
      alert("공유 낚시터 데이터가 없습니다.");
    }
  };

  const handleClickButton = (searchKeyword) => {
    clearMarkersAndInfoWindows();

    searchService.keywordSearch(searchKeyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds(); // 검색 결과 범위
        const newMarkers = [];
        const newInfoWindows = [];

        data.forEach((place) => {
          // 마커 생성 및 지도에 표시
          const markerPosition = new kakao.maps.LatLng(place.y, place.x);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            map: map,
          });
          newMarkers.push(marker);

          // InfoWindow 생성
          const infoWindow = new kakao.maps.InfoWindow({
            content: `
              <div style="padding: 5px;
                      background-color: #ff3d00; color: white; 
                      font-size: 14px;
                      white-space: nowrap;">
                <a href="${place.place_url}" target="_blank" >
                <b style="font-size:16px">${place.place_name}</b>
                </a>
              </div>
              <div style="padding: 10px; white-space: nowrap;">
                <b style="font-size:12px">${place.address_name}</b>
              </div>
            `,
          });
          newInfoWindows.push(infoWindow);

          // 마커 클릭 이벤트 등록
          kakao.maps.event.addListener(marker, "click", () => {
            newInfoWindows.forEach((iw) => iw.close()); // 모든 InfoWindow 닫기
            infoWindow.open(map, marker); // 현재 마커 InfoWindow 열기
          });

          // 결과 범위 확장
          bounds.extend(markerPosition);
        });

        setMarkers(newMarkers);
        setInfoWindows(newInfoWindows);
        setPlaces(data); // 검색 결과 저장
        map.setBounds(bounds); // 지도 범위 확장
        setKeyWord(searchKeyword);
        setIsOpen(true);
      } else {
        alert("검색결과가 없습니다.");
      }
    });
  };

  const handlePlaceClick = (place, index) => {
    const targetPosition = new kakao.maps.LatLng(
      place.lat || place.y,
      place.lng || place.x,
    );

    map.setCenter(targetPosition);
    map.setLevel(3, { anchor: targetPosition });

    infoWindows.forEach((iw) => iw.close());
    infoWindows[index].open(map, markers[index]);
  };

  const handleOpenList = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <HStack
      position="relative" // 부모 컨테이너를 상대 위치로 설정
      mx="auto"
      w="70%"
      h="600px"
      bgColor="gray.100"
      borderRadius="md"
      boxShadow="md"
    >
      {/* 지도 */}
      <Box
        id="map"
        w="100%"
        h="100%"
        bgColor="white"
        borderRadius="md"
        boxShadow="md"
      ></Box>

      {/* 검색 및 목록 패널 */}
      <Stack
        position="absolute" // 지도 위에 패널을 올리기 위해 절대 위치 지정
        top="10px"
        right="10px"
        w="400px" // 패널의 너비 설정
        maxH="90%" // 패널 높이 제한
        bgColor="rgba(255, 255, 255, 0.6)" // 투명도 적용
        borderRadius="md"
        boxShadow="lg"
        p={4}
        zIndex="2" // 패널이 지도보다 위에 표시되도록 설정
      >
        {/* 검색 필드 */}
        <Field>
          <Group>
            <Button
              variant="subtle"
              colorPalette={"blue"}
              value={"민물 낚시"}
              onClick={(e) => handleClickButton(e.target.value)}
            >
              전국 민물 낚시
            </Button>
            <Button
              variant="subtle"
              colorPalette={"blue"}
              value={"배 낚시"}
              onClick={(e) => handleClickButton(e.target.value)}
            >
              전국 배 낚시
            </Button>
            <Button
              variant="subtle"
              colorPalette={"red"}
              onClick={handleShareFishingAddress}
            >
              공유 낚시터
            </Button>
          </Group>
        </Field>

        {/* 검색 결과 목록 */}
        {isOpen && keyWord && (
          <Box
            bgColor="rgba(255, 255, 255, 0.4)" // 검색 결과 목록 배경 투명도 설정
            w="100%"
            h="calc(100% - 60px)" // 검색 필드 높이를 제외한 공간 채우기
            overflowY="scroll"
            borderRadius="md"
            p={2}
          >
            <VStack spacing={2} align="stretch">
              {places.map((place, index) => (
                <Box
                  key={index}
                  p={4}
                  bgColor="rgba(255, 255, 255, 0.5)" // 개별 항목의 배경 투명도 설정
                  borderRadius="md"
                  boxShadow="sm"
                  cursor="pointer"
                  _hover={{ bgColor: "rgba(240, 240, 240, 0.9)" }} // hover 시 조금 더 진하게
                  onClick={() => handlePlaceClick(place, index)}
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {place.place_name || place.number + "번 게시글"}
                  </Text>
                  <Text fontSize="sm">{place.address_name || place.name}</Text>
                  {place.phone && (
                    <Text fontSize="sm" color="gray.600">
                      전화번호: {place.phone}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {keyWord && (
          <IconButton w={"100%"} onClick={handleOpenList} h={"30px"}>
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </IconButton>
        )}
      </Stack>
    </HStack>
  );
}
