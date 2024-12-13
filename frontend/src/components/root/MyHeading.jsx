import { Heading } from "@chakra-ui/react";

export function MyHeading({ children, ...rest }) {
  return (
    <Heading
      size={{ base: "xl", md: "2xl" }}
      mb={2}
      textAlign={"center"}
      {...rest}
    >
      {children}
    </Heading>
  );
}
