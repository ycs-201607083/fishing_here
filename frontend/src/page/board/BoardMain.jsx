import { Box, Center, Flex, Image, Text } from "@chakra-ui/react";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import { useState } from "react";

export function BoardMain() {
  const [tagList, setTagList] = useState([]);

  function handleClick() {
    console.log("클릭");
  }

  const boxStyle = {
    w: "150px",
    h: "150px",
    bgColor: "white",
    textAlign: "center",
  };

  const tagImageStyle = {
    mx: "auto",
    w: "100px",
    h: "100px",
  };

  return (
    <Box>
      <MyHeading>메인페이지</MyHeading>
      <Center mx={"auto"}>
        <Flex gap="4">
          <Box {...boxStyle} onClick={handleClick}>
            <Image
              {...tagImageStyle}
              src={"src/components/Image/가전제품.jpg"}
            />
            <Text mt="4">가전제품</Text>
          </Box>
          <Box {...boxStyle} onClick={handleClick}>
            <Image
              {...tagImageStyle}
              src={"src/components/Image/생활용품.jpg"}
            />
            <Text mt="4">생활용품</Text>
          </Box>
          <Box {...boxStyle} onClick={handleClick}>
            <Image {...tagImageStyle} src={"src/components/Image/학용품.jpg"} />
            <Text mt="4">학용품</Text>
          </Box>
          <Box {...boxStyle} onClick={handleClick}>
            <Image {...tagImageStyle} src={"src/components/Image/의류.jpg"} />
            <Text mt="4">의류</Text>
          </Box>
          <Box {...boxStyle} onClick={handleClick}>
            <Image
              {...tagImageStyle}
              src={"src/components/Image/스포츠용품.jpg"}
            />
            <Text mt="4">스포츠용품</Text>
          </Box>
          <Box {...boxStyle} onClick={handleClick}>
            <Image {...tagImageStyle} src={"src/components/Image/도서.jpg"} />
            <Text mt="4">도서</Text>
          </Box>
        </Flex>
      </Center>
    </Box>
  );
}
