import { Box, Center, Flex, Image, Text } from "@chakra-ui/react";
import { MyHeading } from "../../components/root/MyHeading.jsx";

export function BoardMain() {
  const categories = [
    { name: "가전제품", src: "src/components/Image/가전제품.jpg" },
    { name: "생활용품", src: "src/components/Image/생활용품.jpg" },
    { name: "학용품", src: "src/components/Image/학용품.jpg" },
    { name: "의류", src: "src/components/Image/의류.jpg" },
    { name: "스포츠용품", src: "src/components/Image/스포츠용품.jpg" },
    { name: "도서", src: "src/components/Image/도서.jpg" },
  ];

  const boxStyle = {
    w: "150px",
    h: "150px",
    bgColor: "white",
    textAlign: "center",
    cursor: "pointer",
  };

  const tagImageStyle = {
    mx: "auto",
    w: "100px",
    h: "100px",
  };

  function handleClick(category) {
    console.log(`${category} 클릭`);
  }

  return (
    <Box>
      <MyHeading>메인페이지</MyHeading>
      <Center>
        <Flex gap="4" wrap="wrap" justify="center">
          {categories.map((category) => (
            <Box
              key={category.name}
              {...boxStyle}
              onClick={() => handleClick(category.name)}
            >
              <Image
                {...tagImageStyle}
                src={category.src}
                alt={category.name}
              />
              <Text mt="4">{category.name}</Text>
            </Box>
          ))}
        </Flex>
      </Center>
    </Box>
  );
}
