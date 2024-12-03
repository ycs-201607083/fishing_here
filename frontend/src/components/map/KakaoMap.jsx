import {Box, Group, HStack, IconButton, Input, Stack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Field} from "../ui/field.jsx";
import {LuSearch} from "react-icons/lu";

const {kakao} = window;

export function KakaoMap({searchPlace}) {
  const [map, setMap] = useState(null);
  const [keyWord, setKeyWord] = useState("");

  useEffect(() => {
    //지도 초기화
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    const mapInstance = new kakao.maps.Map(container, options);
    const ps = new kakao.maps.services.Places();

    console.log(searchPlace);

    ps.keywordSearch(searchPlace,)

    setMap(mapInstance);
  }, []);


  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleClickButton();
    }
  };

  const handleClickButton = (e) => {

  };

  return <HStack
    gap={"5"}
    mx="auto"
    w={{md: "1300px"}}
    mt="150px"
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
    <Stack w="300px" h="600px" mx="auto" p={4} borderRadius="md" bgColor="blue.300">
      <Field>
        <Group mx="auto">
          <Input variant="subtle"
                 type="text"
                 placeholder="검색어를 입력하세요"
                 h="38px"
                 value={keyWord} onChange={(e) => setKeyWord(e.target.value)}
                 onKeyDown={handleEnterKey}/>
          <IconButton aria-label="Search database" onClick={handleClickButton}>
            <LuSearch/>
          </IconButton>
        </Group>
      </Field>
      <Box bgColor="white" w="260px" h="600px" mx="auto"></Box>
    </Stack>
    <Box>
    </Box>
  </HStack>
}