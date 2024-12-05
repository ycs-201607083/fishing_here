import {
  Box,
  Group,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Field } from "../ui/field.jsx";
import { LuSearch } from "react-icons/lu";

const { kakao } = window;

export function KakaoMap() {
  const [map, setMap] = useState(null);
  const [keyWord, setKeyWord] = useState(""); // 검색어
  const [searchService, setSearchService] = useState(null); // 장소 검색 서비스
  const [markers, setMarkers] = useState([]); // 마커 관리
  const [infoWindows, setInfoWindows] = useState([]); // InfoWindow 관리
  const [places, setPlaces] = useState([]); // 검색 결과 데이터 저장

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

  function clearMarkersAndInfoWindows() {
    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));
    infoWindows.forEach((infoWindow) => infoWindow.close());
    setMarkers([]);
    setInfoWindows([]);
  }

  const handleClickButton = () => {
    if (!keyWord || !searchService || !map) {
      return;
    }

    clearMarkersAndInfoWindows();

    searchService.keywordSearch(keyWord, (data, status) => {
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
              <div style="padding:10px; white-space: nowrap">
              <a href="${place.place_url}" target="_blank" >
              <b style="font-size:16px">${place.place_name}</b>
                <br/>
                <b style="font-size:12px">${place.address_name}</b>
               </a>
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
      } else {
        alert("검색결과가 없습니다.");
      }
    });
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleClickButton();
    }
  };

  const handlePlaceClick = (place, index) => {
    const targetPosition = new kakao.maps.LatLng(place.y, place.x);

    // 지도 중심 이동 및 줌 설정
    map.setCenter(targetPosition);
    map.setLevel(3, { anchor: new kakao.maps.LatLng(place.y, place.x) }); // 줌 레벨 설정 (1: 가장 확대, 숫자가 클수록 축소)

    // InfoWindow 열기
    infoWindows.forEach((iw) => iw.close()); // 모든 InfoWindow 닫기
    infoWindows[index].open(map, markers[index]); // 해당 마커 InfoWindow 열기
  };

  return (
    <HStack
      gap={"5"}
      mx="auto"
      w={{ md: "1500px" }}
      bgColor="gray.100"
      borderRadius="md"
      boxShadow="md"
      spacing={4}
      p={4}
    >
      {/* 지도 */}
      <Box
        id="map"
        w="1000px"
        h="600px"
        bgColor="white"
        borderRadius="md"
        boxShadow="md"
      ></Box>

      {/* 검색 및 목록 */}
      <Stack
        w="500px"
        h="600px"
        mx="auto"
        p={4}
        borderRadius="md"
        bgColor="blue.300"
        spacing={4}
      >
        {/* 검색 필드 */}
        <Field>
          <Group mx="auto">
            <Input
              variant="subtle"
              type="text"
              placeholder="검색어를 입력하세요"
              w="300px"
              h="38px"
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onKeyDown={handleEnterKey}
            />
            <IconButton
              aria-label="Search database"
              onClick={handleClickButton}
            >
              <LuSearch />
            </IconButton>
          </Group>
        </Field>

        {/* 검색 결과 목록 */}
        <Box bgColor="white" w="450px" h="500px" mx="auto" overflowY="scroll">
          <VStack spacing={2} align="stretch">
            {places.map((place, index) => (
              <Box
                key={index}
                p={4}
                bgColor="gray.100"
                borderRadius="md"
                boxShadow="sm"
                cursor="pointer"
                _hover={{ bgColor: "gray.200" }}
                onClick={() => handlePlaceClick(place, index)}
              >
                <Text fontSize="lg" fontWeight="bold">
                  {place.place_name}
                </Text>
                <Text fontSize="sm">{place.address_name}</Text>
                {place.phone && (
                  <Text fontSize="sm" color="gray.600">
                    전화번호: {place.phone}
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Stack>
    </HStack>
  );
}
