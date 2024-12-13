import {
  Box,
  Heading,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import weatherCityMapFromKr from "../../components/data/weatherCityMapFromKr.json";
import { WeatherCard } from "../../components/root/WeatherCard.jsx";
import { IoIosArrowUp } from "react-icons/io";

import "../../components/css/WeatherApp.css";
import Slider from "react-slick";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomArrow = ({ className, style, onClick, isNext }) => (
  <Box
    as="div"
    className={className}
    onClick={onClick}
    style={{
      ...style,
      zIndex: 1,
      [isNext ? "right" : "left"]: "20px", // 위치 조정
    }}
  ></Box>
);

export function BoardMain() {
  const [cityName, setCityName] = useState("");
  const [annList, setAnnList] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const appKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    axios
      .get("/api/board/boardMain")
      .then((res) => res.data)
      .then((data) => {
        setAnnList(data);
        console.log(data, "불러옴");
      })
      .catch((e) => {
        console.log(e, "못불러옴");
      });
  }, []);

  const getEnglishCityName = (koreanCityName) => {
    return weatherCityMapFromKr[koreanCityName] || koreanCityName;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToScroll: 1,

    nextArrow: <CustomArrow isNext={true} />,
    prevArrow: <CustomArrow isNext={false} />,
  };

  const handleClick = (id) => {
    navigate(`/board/viewAnn/${id}`);
  };

  // 날씨 초기화
  const SearchWeatherByCity = async (city) => {
    try {
      const engCityName = getEnglishCityName(city);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${engCityName}&appid=${appKey}&lang=kr&unit=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        toaster.create({
          type: "error",
          description: "제대로된 도시명, 시를 붙여 입력하세요",
        });
        return;
      }
      const data = await response.json();
      setWeather(data);
      setIsOpen(true);
    } catch (e) {
      toaster.create({
        type: "error",
        description: "제대로된 도시명, 시를 붙여 입력하세요",
      });
      setWeather(null);
    }
  };

  const HandleInputCity = (e) => {
    if (e.key === "Enter") {
      SearchWeatherByCity(cityName);
    }
  };

  function handleButtonClose() {
    setIsOpen(false);
    setTimeout(() => setWeather(null), 2000);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
    >
      <Box
        w={"500px"}
        boxShadow="lg"
        bg="blue.200"
        borderRadius="lg"
        p="5"
        pt="2"
        zIndex={2}
        position="absolute"
      >
        <Heading>Weather</Heading>
        <Stack>
          <Input
            variant="subtle"
            value={cityName}
            textAlign="center"
            fontSize={"20px"}
            placeholder={"도시명을 입력하세요"}
            onChange={(e) => setCityName(e.target.value)}
            onKeyDown={HandleInputCity}
          />

          <div className={`weatherContainer ${isOpen ? "open" : "closed"}`}>
            {weather && <WeatherCard weather={weather} />}

            <IconButton w={"100%"} onClick={handleButtonClose}>
              {/*<IconButton onClick={() => setWeather(null)}>*/}
              <IoIosArrowUp />
            </IconButton>
          </div>
        </Stack>
      </Box>

      <Box w="60%" mt={"150px"} zIndex={1} p={"2"}>
        <Slider {...sliderSettings}>
          {annList.map((ann) => (
            <Box key={ann.id} textAlign="center">
              <Image
                pl={5}
                h={"500px"}
                mx="auto"
                objectFit="fill"
                src={ann.fileList[0].src}
                alt={ann.name}
                onClick={() => handleClick(ann.id)}
              />
              <Text mt="4">{ann.title}</Text>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
