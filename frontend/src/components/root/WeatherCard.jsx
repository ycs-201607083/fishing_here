import { Box, Heading, Text } from "@chakra-ui/react";

export const WeatherCard = ({ weather }) => {
  const { name, main, weather: weatherDetails } = weather;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p="6"
      boxShadow="lg"
      bg="blue.50"
      textAlign="center"
      maxWidth="300px"
      mx="auto"
    >
      <Heading size="lg" mb="4">
        {name}
      </Heading>
      <Text> {weatherDetails[0].description}</Text>
      <Text fontSize="2xl" fontWeight="bold">
        {Math.round(main.temp - 273.15)}°C
      </Text>
      <Text>습도: {main.humidity}%</Text>
    </Box>
  );
};
