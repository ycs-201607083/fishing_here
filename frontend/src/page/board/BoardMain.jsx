import { Box, Center, Image, Input, Text } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import cityMap from "../../components/data/cityMap.json";

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
  const [cityName, setCityName] = useState("서울");
  const [weather, setWeather] = useState(null);
  const appKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    SearchWeatherByCity(cityName);
  }, []);

  const getEnglishCityName = (koreanCityName) => {
    return cityMap[koreanCityName] || koreanCityName;
  };

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

  function handleClick(category) {
    console.log(`${category} 클릭`);
  }

  // 날씨 초기화
  const SearchWeatherByCity = async (city) => {
    try {
      const engCityName = getEnglishCityName(city);

      const url = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${engCityName}&appid=${appKey}&lang=kr&unit=metric`,
      );

      if (!url.ok) {
        toaster.create({
          type: "error",
          description: "제대로된 도시명을 입력하세요",
        });
        const data = await url.json();
        setWeather(data);
      }
    } catch (e) {
      toaster.create({
        type: "error",
        description: "제대로된 도시명을 입력하세요",
      });
      setWeather(null);
    }
  };

  const HandleInputCity = (e) => {
    if (e.key === "Enter") {
      SearchWeatherByCity(cityName);
    }
  };

  return (
    <Box>
      <Center>
        <Input
          w={"40%"}
          value={cityName}
          textAlign="center"
          fontSize={"25px"}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={HandleInputCity}
        />
      </Center>

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
