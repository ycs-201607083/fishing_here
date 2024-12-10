import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Input } from "@chakra-ui/react";
import { Field } from "../ui/field.jsx";
import DaumPostcodeEmbed from "react-daum-postcode";
import { scrollDown } from "../../page/board/BoardAdd.jsx";
import { useAddress } from "../../context/AddressContext.jsx";

function BoardKakaoMap(props) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState([]); // 마커 관리
  const [address, setAddress] = useState(""); //검색된 주소 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const addressContext = useAddress();

  // 1) 카카오맵 불러오기
  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.556535, 126.945108),
        level: 3,
      };
      //카카오맵 생성
      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);
      // 초기 마커 생성
      const markerInstance = new window.kakao.maps.Marker();
      setMarker(markerInstance);
    });
  }, []);

  // 2) 최초 렌더링 시에는 제외하고 map이 변경되면 실행
  useEffect(() => {
    if (map && marker) {
      // 주소-좌표 변환 객체를 생성
      const geocoder = new window.kakao.maps.services.Geocoder();

      //지도 클릭 리스너
      window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        geocoder.coord2Address(
          mouseEvent.latLng.getLng(),
          mouseEvent.latLng.getLat(),
          function (result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              const addr = result[0].road_address
                ? result[0].road_address.address_name
                : result[0].address.address_name;

              console.log(mouseEvent.latLng.getLng()); //경도
              console.log(mouseEvent.latLng.getLat()); //위도

              marker.setMap(null); // 기존 마커를 제거하고 새로운 마커 넣기
              marker.setPosition(mouseEvent.latLng); // 마커를 클릭한 위치에 표시
              marker.setMap(map);
              //주소 상태 업데이트
              setAddress(addr);
              addressContext.setAddress(addr);
              // 클릭한 위치 주소를 가져온다.
              console.log("설정한 주소 = ", addr);
            }
          },
        );
      });
    }
  }, [map, marker]);

  const handlePostClick = () => {
    setIsOpen(true);
  };
  const handleComplete = (e) => {
    const { address } = e;

    // 주소를 좌표로 변환하기 위해 Geocoder 사용
    const geocoder = new window.kakao.maps.services.Geocoder();

    // addressSearch를 통해 주소를 좌표로 변환
    geocoder.addressSearch(address, function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const currentPos = new window.kakao.maps.LatLng(
          result[0].y,
          result[0].x,
        );

        // 지도 위치 이동
        map.panTo(currentPos);

        // 기존 마커 제거 후 새로운 마커로 위치 업데이트
        marker.setMap(null); // 기존 마커를 제거
        marker.setPosition(currentPos); // 새로운 마커 위치 설정
        marker.setMap(map); // 마커를 지도에 다시 추가

        setAddress(address); // Context에 주소 저장
        addressContext.setAddress(address);
      } else {
        console.error("주소를 좌표로 변환할 수 없습니다.");
      }
    });
  };

  const handleClose = (e) => {
    if (e === "FORCE_CLOSE") {
      setIsOpen(false);
    } else if (e === "COMPLETE_CLOSE") {
      setIsOpen(false);
    }
  };
  const handleButtonClose = () => {
    setIsOpen(false);
  };

  scrollDown(isOpen);

  return (
    <Box>
      {/* 지도 영역 */}
      <Box id="map" style={{ width: "100%", height: "400px" }}></Box>

      {/* 주소 검색 및 표시 */}
      <HStack spacing={4} mt={4}>
        <Input
          id="addr"
          value={address}
          readOnly
          placeholder="검색된 주소가 여기에 표시됩니다."
        />
        <Button
          variant={"outline"}
          colorPalette="blue"
          onClick={handlePostClick}
        >
          주소 검색
        </Button>
      </HStack>
      {isOpen && (
        <Field>
          <DaumPostcodeEmbed
            onComplete={handleComplete}
            onClose={handleClose}
          />
          <Button onClick={handleButtonClose} w={{ md: "100%" }}>
            닫기
          </Button>
        </Field>
      )}
    </Box>
  );
}

export default BoardKakaoMap;
