import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { weatherDescriptions } from "../data/WeatherDescriptions.jsx";

export const WeatherCard = ({ weather }) => {
  const { name, main, weather: weatherDetails, wind } = weather;
  // const trans = weatherDescriptions;

  const getWeather = (weatherId) => {
    return weatherDescriptions[weatherId] || "알 수 없는 날씨";
  };

  //날씨코드 번역
  const transWeather = getWeather(weatherDetails[0].id);

  const wIcon = weatherDetails[0].icon;
  const wIconUrl = `https://openweathermap.org/img/wn/${wIcon}@2x.png`;

  return (
    <Box p="6" textAlign="center">
      <Heading size="lg" mb="4">
        {name}
      </Heading>
      <Image w={"200px"} h={"200px"} mx={"auto"} src={wIconUrl} />
      <Text fontSize="2xl" fontWeight="bold">
        {Math.round(main.temp - 273.15)}°C
      </Text>
      <Text fontWeight="bold"> {transWeather}</Text>
      <Flex gap={5} justifyContent="center" alignItems="center" pt={3}>
        <Text>풍속 : {wind.speed} m/s</Text>
        <Text>습도: {main.humidity}%</Text>
      </Flex>
    </Box>
  );
};
