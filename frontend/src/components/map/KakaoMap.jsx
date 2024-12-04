import {Box, Group, HStack, IconButton, Input, Stack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Field} from "../ui/field.jsx";
import {LuSearch} from "react-icons/lu";

const {kakao} = window;

export function KakaoMap() {
  const [map, setMap] = useState(null);
  const [keyWord, setKeyWord] = useState("");//검색어
  const [searchService, setSearchService] = useState(null);//장소검색서비스
  const [marker, setMarker] = useState([]);//마커 관리

  useEffect(() => {
    //지도 초기화
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    const mapInstance = new kakao.maps.Map(container, options);
    //장소검색 초기화
    const ps = new kakao.maps.services.Places();

    setMap(mapInstance);
    setSearchService(ps);
  }, []);

  function clearMarker() {
    // 기존 마커 제거
    marker.forEach((marker) => marker.setMap(null));
    setMarker([]);
  }


  const handleClickButton = (e) => {
    if (!keyWord || !searchService || !map) {
      return;
    }

    clearMarker();


    searchService.keywordSearch(keyWord, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds(); // 검색 결과 범위

        data.forEach((place) => {
          // 마커 생성 및 지도에 표시
          const markerPosition = new kakao.maps.LatLng(place.y, place.x);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            map: map,
          });

          // 새로운 마커 저장
          setMarker((prev) => [...prev, marker]);

          // 결과 범위 확장
          bounds.extend(markerPosition);
        });
        //지도범위 확장
        map.setBounds(bounds);
      } else {
        alert("검색결과가 없습니다.")
      }
    })
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleClickButton();
    }
  };

  return <HStack
    gap={"5"}
    mx="auto"
    w={{md: "1500px"}}
    mt="100px"
    bgColor="gray.100"
    borderRadius="md"
    boxShadow="md"
    spacing={4}
    p={4}>
    <Box id="map"
         w="1000px"
         h="600px"
         bgColor="white"
         borderRadius="md"
         boxShadow="md"></Box>
    <Stack w="500px" h="600px" mx="auto" p={4} borderRadius="md" bgColor="blue.300">
      <Field>
        <Group mx="auto">
          <Input variant="subtle"
                 type="text"
                 placeholder="검색어를 입력하세요"
                 w="300px"
                 h="38px"
                 value={keyWord} onChange={(e) => setKeyWord(e.target.value)}
                 onKeyDown={handleEnterKey}/>
          <IconButton aria-label="Search database" onClick={handleClickButton}>
            <LuSearch/>
          </IconButton>
        </Group>
      </Field>
      <Box bgColor="white" w="450px" h="600px" mx="auto"></Box>
    </Stack>
    <Box>
    </Box>
  </HStack>
}