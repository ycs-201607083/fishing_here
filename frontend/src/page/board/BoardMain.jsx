import { Box, Center, Image, Text } from "@chakra-ui/react";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";

function NexArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", backgroundColor: "green" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}

export function BoardMain() {
  const [cityName, setCityName] = useState("");
  const appKey = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appKey}`;

  useEffect(() => {
    setCityName("seoul");
  }, []);

  console.log(cityName);

  const categories = [
    { name: "가전제품", src: "src/components/Image/가전제품.jpg" },
    { name: "생활용품", src: "src/components/Image/생활용품.jpg" },
    { name: "학용품", src: "src/components/Image/학용품.jpg" },
    { name: "의류", src: "src/components/Image/의류.jpg" },
    { name: "스포츠용품", src: "src/components/Image/스포츠용품.jpg" },
    { name: "도서", src: "src/components/Image/도서.jpg" },
  ];

  const sliderSettings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <NexArrow />,
    prevArrow: <PrevArrow />,
  };

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
        <Box w="40%">
          <Slider {...sliderSettings}>
            {categories.map((category) => (
              <Box
                key={category.name}
                textAlign="center"
                cursor="pointer"
                onClick={() => handleClick(category.name)}
              >
                <Image
                  mx="auto"
                  w="100px"
                  h="100px"
                  src={category.src}
                  alt={category.name}
                />
                <Text mt="4">{category.name}</Text>
              </Box>
            ))}
          </Slider>
        </Box>
      </Center>
    </Box>
  );
}
